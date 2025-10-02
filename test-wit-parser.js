// test-wit-parser.js
// Simple test script to verify WIT-Motion parser functionality

const { WitMotionParser } = require('./electron/WitMotionParser.js');

console.log('🧪 Testing WIT-Motion Parser...\n');

// Create parser with callback
const parser = new WitMotionParser((witData) => {
  console.log('📡 Raw WIT data received:', witData);
  const processed = WitMotionParser.processWitMotionData(witData);
  if (processed) {
    console.log('✅ Processed IMU data:', {
      heading: processed.heading.toFixed(1) + '°',
      pitch: processed.pitch ? processed.pitch.toFixed(1) + '°' : 'N/A',
      roll: processed.roll ? processed.roll.toFixed(1) + '°' : 'N/A',
      hasAcceleration: !!processed.acceleration,
      hasGyroscope: !!processed.gyroscope,
      hasMagnetometer: !!processed.magnetometer,
      hasQuaternion: !!processed.quaternion,
      temperature: processed.temperature ? processed.temperature.toFixed(1) + '°C' : 'N/A'
    });
  } else {
    console.log('❌ Failed to process WIT data');
  }
  console.log('---');
});

// Test data - simulate various WIT-Motion packet types
console.log('Testing 0x53 (Angle) packet...');
const anglePacket = Buffer.from([0x55, 0x53, 0x00, 0x80, 0x00, 0x40, 0x00, 0x20, 0x00, 0x10, 0x00]); // Example angle data
parser.push(anglePacket);

console.log('\nTesting 0x51 (Acceleration) packet...');
const accelPacket = Buffer.from([0x55, 0x51, 0x00, 0x80, 0x00, 0x40, 0x00, 0x20, 0x00, 0x10, 0x00]); // Example accel data
parser.push(accelPacket);

console.log('\nTesting 0x52 (Gyroscope) packet...');
const gyroPacket = Buffer.from([0x55, 0x52, 0x00, 0x80, 0x00, 0x40, 0x00, 0x20, 0x00, 0x10, 0x00]); // Example gyro data
parser.push(gyroPacket);

console.log('\nTesting 0x59 (Quaternion) packet...');
const quatPacket = Buffer.from([0x55, 0x59, 0x00, 0x80, 0x00, 0x40, 0x00, 0x20, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]); // Example quat data
parser.push(quatPacket);

console.log('\nTesting 0x61 (Combined) packet...');
const combinedPacket = Buffer.from([
  0x55, 0x61, // Header
  0x00, 0x80, 0x00, 0x40, 0x00, 0x20, // acc x,y,z
  0x00, 0x10, 0x00, 0x08, 0x00, 0x04, // gyro x,y,z
  0x00, 0x02, 0x00, 0x01, 0x00, 0x00  // angle roll,pitch,yaw
]);
parser.push(combinedPacket);

console.log('\n✅ WIT-Motion Parser test completed!');
