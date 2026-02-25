// 2D Kalman filter (x, y, vx, vy) + heading complementary filter
// Designed for short-range boat navigation fusion of GNSS + IMU
// With outlier rejection, velocity damping, and tuned for WIT-Motion IMU drift
export interface IMUData {
  heading: number;
  pitch?: number;
  roll?: number;
  acceleration?: { x: number; y: number; z: number };
  gyroscope?: { x: number; y: number; z: number };
  timestamp: string | number | Date;
}

export interface GPSData {
  latitude: number;
  longitude: number;
  altitude?: number;
  speed?: number;
  heading?: number; // course over ground
  accuracy?: number; // meters
  quality?: number; // 0=invalid, 1=GPS, 2=DGPS, 4=RTK fixed, 5=RTK float
  satellites?: number;
  hdop?: number;
  timestamp: string | number | Date;
}

export interface FusedPosition {
  latitude: number;
  longitude: number;
  heading: number;
  elevation: number;
  speed: number;
  accuracy: number;
  timestamp: string | number | Date;
}

function deg2rad(d: number) { return (d * Math.PI) / 180; }

function wrapAngleDeg(a: number) {
  let x = a % 360;
  if (x < -180) x += 360;
  if (x > 180) x -= 360;
  return x;
}

export class Fusion {
  // reference origin for local ENU frame
  private lat0: number | null = null;
  private lon0: number | null = null;

  // state in local meters: x-east, y-north, vx, vy
  private x = 0;
  private y = 0;
  private vx = 0;
  private vy = 0;

  // covariance (diagonal approximation)
  private px = 10;
  private py = 10;
  private pvx = 1;
  private pvy = 1;

  // heading state (deg) tracked separately
  private heading = 0;
  private headingInitialized = false;

  // last timestamp (ms)
  private lastTs: number | null = null;

  // last GPS position for outlier rejection
  private lastGpsX: number | null = null;
  private lastGpsY: number | null = null;
  private lastGpsTs: number | null = null;

  // tuning - balanced for WIT-Motion IMU which drifts significantly
  private processNoisePos = 0.3;
  private processNoiseVel = 0.3;
  private gnssMeasurementNoise = 3; // meters - trust GPS more
  private headingAlpha = 0.7; // lowered: 70% IMU, 30% GPS COG correction per update
  private velocityDamping = 0.95; // damp velocity each predict step to prevent runaway drift
  private maxJumpMeters = 50; // reject GPS jumps larger than this

  constructor() {}

  // convert lat/lon to local meters (approx)
  private geoToLocal(lat: number, lon: number) {
    if (this.lat0 === null || this.lon0 === null) {
      this.lat0 = lat;
      this.lon0 = lon;
    }
    const lat0 = this.lat0!;
    const lon0 = this.lon0!;
    const metersPerDeg = 111320;
    const dx = (lon - lon0) * Math.cos(deg2rad(lat0)) * metersPerDeg;
    const dy = (lat - lat0) * metersPerDeg;
    return { x: dx, y: dy };
  }

  private localToGeo(x: number, y: number) {
    const lat0 = this.lat0 ?? 0;
    const lon0 = this.lon0 ?? 0;
    const metersPerDeg = 111320;
    const lat = lat0 + y / metersPerDeg;
    const lon = lon0 + x / (Math.cos(deg2rad(lat0)) * metersPerDeg);
    return { latitude: lat, longitude: lon };
  }

  processGNSS(gps: GPSData) {
    const ts = typeof gps.timestamp === 'number' ? gps.timestamp : new Date(gps.timestamp).getTime();

    // Reject invalid fix quality (0 = no fix)
    if (gps.quality !== undefined && gps.quality === 0) {
      return;
    }

    if (!this.lat0 || !this.lon0) {
      // initialize state
      this.lat0 = gps.latitude;
      this.lon0 = gps.longitude;
      const p = this.geoToLocal(gps.latitude, gps.longitude);
      this.x = p.x;
      this.y = p.y;
      this.vx = 0;
      this.vy = 0;
      this.px = 10;
      this.py = 10;
      this.pvx = 1;
      this.pvy = 1;
      this.lastTs = ts;
      this.lastGpsX = p.x;
      this.lastGpsY = p.y;
      this.lastGpsTs = ts;
      if (gps.heading !== undefined) {
        this.heading = gps.heading;
        this.headingInitialized = true;
      }
      return;
    }

    // Predict to measurement time
    if (this.lastTs !== null) {
      const dt = Math.max(0, (ts - this.lastTs) / 1000);
      if (dt > 0 && dt < 10) { // reject stale updates > 10s
        this.predict(dt);
      }
    }

    // Measurement in local coords
    const { x: mx, y: my } = this.geoToLocal(gps.latitude, gps.longitude);

    // Outlier rejection: reject GPS jumps that are physically impossible
    if (this.lastGpsX !== null && this.lastGpsY !== null && this.lastGpsTs !== null) {
      const dx = mx - this.lastGpsX;
      const dy = my - this.lastGpsY;
      const jumpDist = Math.sqrt(dx * dx + dy * dy);
      const dtGps = (ts - this.lastGpsTs) / 1000;

      // If jump is too large for the time elapsed (> 50m or > 30m/s implied speed), reject
      if (jumpDist > this.maxJumpMeters || (dtGps > 0 && jumpDist / dtGps > 30)) {
        console.warn(`[Fusion] GPS outlier rejected: jump=${jumpDist.toFixed(1)}m in ${dtGps.toFixed(1)}s`);
        this.lastTs = ts;
        return;
      }
    }

    this.lastGpsX = mx;
    this.lastGpsY = my;
    this.lastGpsTs = ts;

    // Adaptive measurement noise based on GPS quality
    let R = this.gnssMeasurementNoise;
    if (gps.accuracy !== undefined && gps.accuracy > 0) {
      R = Math.max(1, gps.accuracy);
    } else if (gps.hdop !== undefined) {
      R = Math.max(1, gps.hdop * 2.5); // approximate: HDOP * CEP multiplier
    }
    // Increase noise for poor fix quality
    if (gps.quality !== undefined) {
      if (gps.quality === 1) R = Math.max(R, 5);      // standalone GPS
      else if (gps.quality === 2) R = Math.max(R, 3);  // DGPS
      else if (gps.quality === 5) R = Math.max(R, 2);  // RTK float
      // quality 4 (RTK fixed) = trust R as-is
    }

    // Kalman update per axis
    const kx = this.px / (this.px + R);
    this.x = this.x + kx * (mx - this.x);
    this.px = (1 - kx) * this.px + this.processNoisePos;

    const ky = this.py / (this.py + R);
    this.y = this.y + ky * (my - this.y);
    this.py = (1 - ky) * this.py + this.processNoisePos;

    // Update velocity using GNSS speed + COG if provided
    if (gps.speed !== undefined && gps.speed > 0.1 && gps.heading !== undefined) {
      const speed_mps = gps.speed;
      const hr = deg2rad(gps.heading);
      const vx_meas = speed_mps * Math.sin(hr);
      const vy_meas = speed_mps * Math.cos(hr);
      const kvx = this.pvx / (this.pvx + 1);
      this.vx = this.vx + kvx * (vx_meas - this.vx);
      this.pvx = (1 - kvx) * this.pvx + this.processNoiseVel;
      const kvy = this.pvy / (this.pvy + 1);
      this.vy = this.vy + kvy * (vy_meas - this.vy);
      this.pvy = (1 - kvy) * this.pvy + this.processNoiseVel;
    }

    // Heading correction with GNSS COG when speed is meaningful
    if (gps.heading !== undefined && (gps.speed ?? 0) > 0.5) {
      if (!this.headingInitialized) {
        this.heading = gps.heading;
        this.headingInitialized = true;
      } else {
        // Stronger correction toward GNSS heading (30% weight per update)
        const diff = wrapAngleDeg(gps.heading - this.heading);
        this.heading = this.heading + (1 - this.headingAlpha) * diff;
      }
    }

    this.lastTs = ts;
  }

  processIMU(imu: IMUData) {
    const ts = typeof imu.timestamp === 'number' ? imu.timestamp : new Date(imu.timestamp).getTime();
    if (this.lastTs === null) this.lastTs = ts;
    const dt = Math.max(0, (ts - this.lastTs) / 1000);

    // Reject stale IMU updates
    if (dt > 2) {
      this.lastTs = ts;
      return;
    }

    // Predict using current velocity (with damping)
    if (dt > 0) {
      this.predict(dt);
    }

    // Heading update: complementary filter with IMU
    if (imu.heading !== undefined) {
      if (!this.headingInitialized) {
        this.heading = imu.heading;
        this.headingInitialized = true;
      } else {
        // 70% weight toward IMU heading each update (reduced from 98%)
        const diff = wrapAngleDeg(imu.heading - this.heading);
        this.heading = this.heading + this.headingAlpha * diff;
      }
    }

    // NOTE: Raw acceleration integration is DISABLED
    // WIT-Motion MEMS accelerometers have significant bias drift.
    // Without proper gravity removal and bias estimation, integrating
    // acceleration causes unbounded velocity/position drift.
    // The Kalman filter position is driven by GPS measurements only,
    // which is far more reliable for boat navigation.

    this.lastTs = ts;
  }

  // Predict step with velocity damping to prevent runaway drift
  private predict(dt: number) {
    if (dt <= 0) return;

    // Apply velocity damping (drag model - boats slow down without thrust)
    this.vx *= Math.pow(this.velocityDamping, dt);
    this.vy *= Math.pow(this.velocityDamping, dt);

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Grow covariance
    this.px += this.processNoisePos * dt;
    this.py += this.processNoisePos * dt;
    this.pvx += this.processNoiseVel * dt;
    this.pvy += this.processNoiseVel * dt;
  }

  getFused(): FusedPosition | null {
    if (this.lat0 === null || this.lon0 === null) return null;
    const geo = this.localToGeo(this.x, this.y);
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    return {
      latitude: geo.latitude,
      longitude: geo.longitude,
      heading: (this.heading + 360) % 360,
      elevation: 0,
      speed,
      accuracy: Math.max(1, Math.sqrt(this.px + this.py)),
      timestamp: this.lastTs ?? Date.now(),
    };
  }
}
