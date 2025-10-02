// src/services/WitMotionParser.ts
// Comprehensive WIT-Motion IMU parser supporting all formats (0x61 combo, 0x50-0x5A classic, 0x71 register)

export interface WitMotionData {
  acc?: { x: number; y: number; z: number };
  gyro?: { x: number; y: number; z: number };
  angle?: { roll: number; pitch: number; yaw: number };
  mag?: { x: number; y: number; z: number };
  quat?: { w: number; x: number; y: number; z: number };
  temp?: number;
}

export interface ProcessedIMUData {
  heading: number;  // deg [0,360) - derived from yaw or quaternion
  pitch?: number;   // deg
  roll?: number;    // deg
  acceleration?: { x: number; y: number; z: number };
  gyroscope?: { x: number; y: number; z: number };
  magnetometer?: { x: number; y: number; z: number };
  quaternion?: { w: number; x: number; y: number; z: number };
  temperature?: number;
}

const WitReg = {
  Quaternion: 0x00,
  Magnetometer: 0x01,
  Temperature: 0x02,
};

export class WitMotionParser {
  private buf: number[] = [];        // rolling input buffer
  private comb61: number[] = [];     // for fragmented 0x61 bodies
  private onDataCallback?: (data: WitMotionData) => void;

  constructor(onData?: (data: WitMotionData) => void) {
    this.onDataCallback = onData;
  }

  setOnDataCallback(callback: (data: WitMotionData) => void) {
    this.onDataCallback = callback;
  }

  push(bytes: Buffer | Uint8Array) {
    // Convert to number array for processing
    for (const b of bytes) this.buf.push(b);

    while (this.buf.length >= 3) {
      if (this.buf[0] !== 0x55) { 
        this.buf.shift(); 
        continue; 
      }
      const id = this.buf[1];

      // --- Combined 0x61: 0x55 0x61 + 18 bytes (no checksum) ---
      if (id === 0x61) {
        if (this.buf.length >= 20) {
          const pkt = this.buf.slice(0, 20);
          this.decode61(pkt.slice(2, 20));
          this.buf.splice(0, 20);
          continue;
        }
        // fragmented case
        if (this.buf.length > 2) {
          let take = 0;
          for (let i = 2; i < this.buf.length; i++) {
            if (this.buf[i] === 0x55) break;
            take++;
          }
          if (take > 0) {
            const chunk = this.buf.slice(2, 2 + take);
            this.comb61.push(...chunk);
            this.buf.splice(0, 2 + take);
            while (this.comb61.length >= 18) {
              const body = this.comb61.slice(0, 18);
              this.decode61(body);
              this.comb61 = this.comb61.slice(18);
            }
            continue;
          }
          break;
        }
        break;
      }

      // --- Classic 0x50–0x5A: 11 bytes with checksum ---
      if (id >= 0x50 && id <= 0x5A) {
        if (this.buf.length < 11) break;
        const pkt = this.buf.slice(0, 11);
        const sum = pkt.slice(0, 10).reduce((a, v) => (a + v) & 0xff, 0);
        if (sum !== pkt[10]) { 
          this.buf.shift(); 
          continue; 
        }
        this.decodeStd(pkt);
        this.buf.splice(0, 11);
        continue;
      }

      // --- Register 0x71: 22 (with checksum) or 20 (no checksum) ---
      if (id === 0x71) {
        if (this.buf.length >= 22) {
          const pkt = this.buf.slice(0, 22);
          const sum = pkt.slice(0, 21).reduce((a, v) => (a + v) & 0xff, 0);
          if (sum === pkt[21]) {
            this.decode71(pkt.slice(2, 20));
            this.buf.splice(0, 22);
            continue;
          }
        }
        if (this.buf.length >= 20) {
          const pkt = this.buf.slice(0, 20);
          this.decode71(pkt.slice(2, 20));
          this.buf.splice(0, 20);
          continue;
        }
        break;
      }

      // unknown → resync
      this.buf.shift();
    }
  }

  private i16(lo: number, hi: number): number {
    let v = (hi << 8) | lo;
    if (v & 0x8000) v -= 0x10000;
    return v;
  }

  private decode61(body18: number[]) {
    const i16 = (i: number) => this.i16(body18[i], body18[i + 1]);
    const g = 9.80665;

    const ax = (i16(0) / 32768) * 16 * g;
    const ay = (i16(2) / 32768) * 16 * g;
    const az = (i16(4) / 32768) * 16 * g;
    const gx = (i16(6) / 32768) * 2000;
    const gy = (i16(8) / 32768) * 2000;
    const gz = (i16(10) / 32768) * 2000;
    const roll = (i16(12) / 32768) * 180;
    const pitch = (i16(14) / 32768) * 180;
    const yaw = (i16(16) / 32768) * 180;

    const out: WitMotionData = {
      acc: { x: ax, y: ay, z: az },
      gyro: { x: gx, y: gy, z: gz },
      angle: { roll, pitch, yaw },
    };
    
    this.onDataCallback?.(out);
  }

  private decodeStd(pkt11: number[]) {
    const id = pkt11[1];
    const p = (i: number) => pkt11[2 + i];
    const i16 = (i: number) => this.i16(p(i), p(i + 1));

    const out: WitMotionData = {};
    switch (id) {
      case 0x51: { // ACC (m/s^2)
        const g = 9.80665;
        out.acc = {
          x: (i16(0) / 32768) * 16 * g,
          y: (i16(2) / 32768) * 16 * g,
          z: (i16(4) / 32768) * 16 * g,
        };
        break;
      }
      case 0x52: { // GYRO (deg/s)
        out.gyro = {
          x: (i16(0) / 32768) * 2000,
          y: (i16(2) / 32768) * 2000,
          z: (i16(4) / 32768) * 2000,
        };
        break;
      }
      case 0x53: { // ANGLE (deg)
        out.angle = {
          roll: (i16(0) / 32768) * 180,
          pitch: (i16(2) / 32768) * 180,
          yaw: (i16(4) / 32768) * 180,
        };
        break;
      }
      case 0x54: { // MAG (raw)
        out.mag = { x: i16(0), y: i16(2), z: i16(4) };
        break;
      }
      case 0x59: { // QUAT (unitless)
        out.quat = {
          w: i16(0) / 32768,
          x: i16(2) / 32768,
          y: i16(4) / 32768,
          z: i16(6) / 32768,
        };
        break;
      }
      default: 
        break;
    }
    
    if (out.acc || out.gyro || out.angle || out.mag || out.quat) {
      this.onDataCallback?.(out);
    }
  }

  private decode71(data18: number[]) {
    const reg = data18[0];
    const i16 = (i: number) => this.i16(data18[i], data18[i + 1]);
    const out: WitMotionData = {};

    switch (reg) {
      case WitReg.Quaternion:
        out.quat = {
          w: i16(2) / 32768,
          x: i16(4) / 32768,
          y: i16(6) / 32768,
          z: i16(8) / 32768,
        };
        break;
      case WitReg.Magnetometer:
        out.mag = {
          x: i16(2),
          y: i16(4),
          z: i16(6),
        };
        break;
      case WitReg.Temperature:
        out.temp = i16(2) / 100; // °C
        break;
      default:
        break;
    }

    if (out.acc || out.gyro || out.angle || out.mag || out.quat || out.temp !== undefined) {
      this.onDataCallback?.(out);
    }
  }

  // Convert WIT-Motion data to our standard IMU format
  static processWitMotionData(witData: WitMotionData): ProcessedIMUData | null {
    try {
      const result: ProcessedIMUData = {
        heading: 0,
      };

      // Extract heading from yaw or quaternion
      if (witData.angle?.yaw !== undefined) {
        result.heading = ((witData.angle.yaw % 360) + 360) % 360;
        result.pitch = witData.angle.pitch;
        result.roll = witData.angle.roll;
      } else if (witData.quat) {
        // Convert quaternion to yaw (heading)
        const { w, x, y, z } = witData.quat;
        const siny_cosp = 2 * (w * z + x * y);
        const cosy_cosp = 1 - 2 * (y * y + z * z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp) * 180 / Math.PI;
        result.heading = ((yaw % 360) + 360) % 360;
      } else {
        return null; // No heading data available
      }

      // Add other sensor data if available
      if (witData.acc) {
        result.acceleration = witData.acc;
      }
      if (witData.gyro) {
        result.gyroscope = witData.gyro;
      }
      if (witData.mag) {
        result.magnetometer = witData.mag;
      }
      if (witData.quat) {
        result.quaternion = witData.quat;
      }
      if (witData.temp !== undefined) {
        result.temperature = witData.temp;
      }

      return result;
    } catch (error) {
      console.error('Error processing WIT-Motion data:', error);
      return null;
    }
  }
}
