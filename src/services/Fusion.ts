// Simple 2D Kalman filter (x, y, vx, vy) + heading complementary filter
// Designed for short-range boat navigation fusion of GNSS + IMU
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

// Very small helper for angle wrapping
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

  // covariance (4x4) - simplified as diagonal for prototype
  private px = 5;
  private py = 5;
  private pvx = 1;
  private pvy = 1;

  // heading state (deg) tracked separately
  private heading = 0; // degrees
  private headingInitialized = false;

  // last timestamp (ms)
  private lastTs: number | null = null;

  // tuning
  private processNoisePos = 0.5; // m^2/s^2
  private processNoiseVel = 0.5; // (m/s)^2
  private gnssMeasurementNoise = 5; // meters
  private headingAlpha = 0.98; // complementary filter weight for IMU heading

  constructor() {}

  // convert lat/lon to local meters (approx)
  private geoToLocal(lat: number, lon: number) {
    if (this.lat0 === null || this.lon0 === null) {
      this.lat0 = lat;
      this.lon0 = lon;
    }
    const lat0 = this.lat0!;
    const lon0 = this.lon0!;
    const metersPerDeg = 111320; // approx
    const dx = (lon - lon0) * Math.cos(deg2rad(lat0)) * metersPerDeg; // east
    const dy = (lat - lat0) * metersPerDeg; // north
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
    if (!this.lat0 || !this.lon0) {
      // initialize state
      this.lat0 = gps.latitude;
      this.lon0 = gps.longitude;
      const p = this.geoToLocal(gps.latitude, gps.longitude);
      this.x = p.x;
      this.y = p.y;
      this.vx = 0;
      this.vy = 0;
      this.px = 5;
      this.py = 5;
      this.pvx = 1;
      this.pvy = 1;
      this.lastTs = ts;
      if (gps.heading !== undefined) {
        this.heading = gps.heading;
        this.headingInitialized = true;
      }
      return;
    }

    // Predict to measurement time
    if (this.lastTs !== null) {
      const dt = Math.max(0, (ts - this.lastTs) / 1000);
      this.predict(dt);
    }

    // Measurement update (x,y)
    const { x: mx, y: my } = this.geoToLocal(gps.latitude, gps.longitude);
    const R = Math.max(this.gnssMeasurementNoise, gps.accuracy ?? this.gnssMeasurementNoise);

    // simple kalman update per axis (assumes little coupling) - prototype
    const kx = this.px / (this.px + R);
    this.x = this.x + kx * (mx - this.x);
    this.px = (1 - kx) * this.px + this.processNoisePos;

    const ky = this.py / (this.py + R);
    this.y = this.y + ky * (my - this.y);
    this.py = (1 - ky) * this.py + this.processNoisePos;

    // update velocity using GNSS speed+heading if provided
    if (gps.speed && gps.heading !== undefined) {
      const speed_mps = gps.speed; // assume already m/s; if knots, caller should convert
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
        // small correction toward GNSS heading
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
    // Predict using current velocity
    this.predict(dt);

    // Heading update: prefer IMU heading (gyro/mag) via complementary filter
    if (imu.heading !== undefined) {
      if (!this.headingInitialized) {
        this.heading = imu.heading;
        this.headingInitialized = true;
      } else {
        // Combine IMU heading (fast) with current heading estimate (slow)
        const diff = wrapAngleDeg(imu.heading - this.heading);
        this.heading = this.heading + this.headingAlpha * diff;
      }
    }

    // Optionally, integrate acceleration to update velocity (body -> world)
    if (imu.acceleration && this.headingInitialized) {
      // assume acceleration units are m/s^2 and in IMU body frame X forward, Y right? If uncertain, user can adapt
      const ax = imu.acceleration.x;
      const ay = imu.acceleration.y;
      // rotate to world frame assuming heading is yaw (deg) and IMU axes align: forward -> north
      const hrad = deg2rad(this.heading);
      // body forward (x) maps to north (y) when heading=0; adjust signs as needed per IMU convention
      const accEast = ax * Math.sin(hrad) + ay * Math.cos(hrad);
      const accNorth = ax * Math.cos(hrad) - ay * Math.sin(hrad);

      this.vx += accEast * dt;
      this.vy += accNorth * dt;
      // increase covariance due to process noise
      this.pvx += this.processNoiseVel * dt;
      this.pvy += this.processNoiseVel * dt;
    }

    this.lastTs = ts;
  }

  // simple predict step for constant-velocity model
  private predict(dt: number) {
    if (dt <= 0) return;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    // grow covariance
    this.px += Math.abs(this.vx) * this.processNoisePos * dt + this.processNoisePos * dt;
    this.py += Math.abs(this.vy) * this.processNoisePos * dt + this.processNoisePos * dt;
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
