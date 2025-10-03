// src/services/DataProcessor.ts
import { WitMotionParser, WitMotionData } from './WitMotionParser';

export type IMUOut = {
  heading: number;  // deg [0,360)
  pitch?: number;
  roll?: number;
  acceleration?: { x:number; y:number; z:number };
  gyroscope?: { x:number; y:number; z:number };
  magnetometer?: { x:number; y:number; z:number };
  quaternion?: { w:number; x:number; y:number; z:number };
  temperature?: number;
};

export type GPSOut = {
  latitude: number;
  longitude: number;
  altitude?: number;
  speed?: number;
  heading?: number; // COG if you ever want it, but we will NOT use it to drive UI
  accuracy?: number;
};

const toDeg = (r:number)=> r*180/Math.PI;
const norm360 = (d:number)=> ((d%360)+360)%360;

function pitchRollFromAccel(ax:number, ay:number, az:number){
  const roll  = toDeg(Math.atan2(ay, az));
  const pitch = toDeg(Math.atan2(-ax, Math.sqrt(ay*ay + az*az)));
  return { pitch, roll };
}


export class DataProcessor {
  private lastIMU: IMUOut | null = null;
  private lastGPS_Primary: GPSOut | null = null;
  private lastGPS_Secondary: GPSOut | null = null;
  private witMotionParser: WitMotionParser;

  constructor() {
    this.witMotionParser = new WitMotionParser((witData: WitMotionData) => {
      const processed = WitMotionParser.processWitMotionData(witData);
      if (processed) {
        this.lastIMU = processed;
      }
    });
  }

  getLastIMU(){ return this.lastIMU; }
  getLastPrimary(){ return this.lastGPS_Primary; }
  getLastSecondary(){ return this.lastGPS_Secondary; }

  // ---- Process binary IMU data through WIT-Motion parser ----
  processBinaryIMUData(data: Buffer | Uint8Array): IMUOut | null {
    try {
      this.witMotionParser.push(data);
      return this.lastIMU;
    } catch (error) {
      console.error('Binary IMU processing error:', error);
      return null;
    }
  }

  // ---- IMU parser (accept object with heading, NMEA, CSV, JSON). Keep yours if you already have it. ----
  processIMUData(line: unknown): IMUOut | null {
    try {
      if (typeof line === 'object' && line !== null) {
        const j:any = line;
        const heading = j.heading ?? j.yaw ?? j.orientation?.yaw ?? null;
        let pitch   = j.pitch ?? j.orientation?.pitch ?? null;
        let roll    = j.roll ?? j.orientation?.roll ?? null;

        const ax = j.ax ?? j.acceleration?.x;
        const ay = j.ay ?? j.acceleration?.y;
        const az = j.az ?? j.acceleration?.z;

        if ((pitch == null || roll == null) && [ax,ay,az].every(v => typeof v === 'number')) {
          const pr = pitchRollFromAccel(ax,ay,az);
          pitch = pitch ?? pr.pitch; roll = roll ?? pr.roll;
        }

        if (heading == null) return null;
        const out: IMUOut = {
          heading: norm360(Number(heading)),
          pitch: pitch != null ? Number(pitch) : undefined,
          roll:  roll  != null ? Number(roll)  : undefined,
          acceleration: (ax!=null && ay!=null && az!=null) ? {x:Number(ax),y:Number(ay),z:Number(az)} : undefined,
          gyroscope: j.gyroscope
        };
        this.lastIMU = out;
        return out;
      }

      if (typeof line === 'string') {
        const s = line.trim();

        // $HCHDT,xxx,T - GPS HEADING - IGNORE THIS (we only want IMU heading)
        // if (s.startsWith('$') && s.includes('HDT')) {
        //   const parts = s.split(',');
        //   const deg = parseFloat(parts[1]);
        //   if (!isNaN(deg)) {
        //     const out: IMUOut = { heading: norm360(deg) };
        //     this.lastIMU = out; return out;
        //   }
        // }

        // $PASHR,hhmmss.sss,heading,roll,pitch,... - GPS HEADING - IGNORE THIS (we only want IMU heading)
        // if (s.startsWith('$PASHR')) {
        //   const p = s.split(',');
        //   const heading = parseFloat(p[2]);
        //   const roll    = parseFloat(p[3]);
        //   const pitch   = parseFloat(p[4]);
        //   if (![heading,roll,pitch].some(isNaN)) {
        //     const out: IMUOut = { heading: norm360(heading), pitch, roll };
        //     this.lastIMU = out; return out;
        //   }
        // }

        // JSON
        if (s.startsWith('{') && s.endsWith('}')) {
          return this.processIMUData(JSON.parse(s));
        }

        // CSV: ax,ay,az,gx,gy,gz,pitch,roll,yaw
        const csv = s.split(',').map(x=>x.trim());
        if (csv.length >= 9 && csv.every(x => !isNaN(Number(x)))) {
          const [ax,ay,az,,,pitch,roll,yaw] = csv.map(Number);
          if (isNaN(yaw)) return null;
          const out: IMUOut = {
            heading: norm360(yaw),
            pitch: isNaN(pitch)? undefined : pitch,
            roll:  isNaN(roll) ? undefined : roll,
            acceleration: {x:ax,y:ay,z:az}
          };
          this.lastIMU = out; return out;
        }
      }

      return null;
    } catch (e) {
      console.error('IMU parse error:', e);
      return null;
    }
  }

  // ---- GNSS normalizer: accept object with {latitude, longitude} (what your main.ts emits) ----
  processGPSData(obj: any, isPrimary: boolean): GPSOut | null {
    try {
      if (!obj || typeof obj !== 'object') return null;
      const lat = Number(obj.latitude);
      const lon = Number(obj.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

      const out: GPSOut = {
        latitude: lat,
        longitude: lon,
        altitude: obj.altitude != null ? Number(obj.altitude) : undefined,
        speed: obj.speed != null ? Number(obj.speed) : undefined,
        accuracy: obj.accuracy != null ? Number(obj.accuracy) : undefined,
        // obj.heading may exist (COG), but we will IGNORE it for UI heading
      };

      if (isPrimary) this.lastGPS_Primary = out;
      else this.lastGPS_Secondary = out;
      return out;
    } catch (e) {
      console.error('GPS parse error:', e);
      return null;
    }
  }
}
