# Navigation System

A professional-grade boat navigation system built with Electron + React that provides precise positioning and heading tracking using dual GNSS receivers and IMU sensor fusion.

## 🌊 Product Overview

The Navigation System is a comprehensive maritime navigation solution designed for boats and marine vessels. It combines cutting-edge sensor technology with advanced data fusion algorithms to deliver pinpoint positioning accuracy and precise heading information even in challenging marine environments.

### Key Features

- **Dual GNSS Positioning**: Uses two u-blox GNSS receivers for redundancy and enhanced accuracy
- **IMU Sensor Fusion**: Integrates WIT-Motion IMU sensors for precise heading and attitude tracking
- **Real-time Data Fusion**: Advanced Kalman filtering combines GPS and IMU data for optimal navigation
- **Interactive Mapping**: Open-source mapping with waypoint management and route planning
- **Offline Capability**: Works without internet connection for true marine reliability
- **Professional UI**: Clean, responsive interface optimized for marine environments

## 📡 Supported Devices

### GNSS Receivers
- **Primary & Secondary u-blox GNSS Receivers**
  - Standard baud rates: 1200-921600 bps (default: 38400)
  - NMEA 0183 protocol support
  - GGA sentence parsing for position data
  - Dual-receiver redundancy for enhanced reliability

### IMU Sensors
- **WIT-Motion IMU Sensors**
  - Comprehensive support for multiple data formats:
    - 0x61 combo format (accelerometer + gyroscope + angle + magnetometer + quaternion)
    - 0x50-0x5A classic formats (individual sensor data)
    - 0x71 register format
  - Data types supported:
    - Accelerometer (m/s²)
    - Gyroscope (deg/s)
    - Euler angles (roll, pitch, yaw)
    - Magnetometer (raw values)
    - Quaternion orientation
    - Temperature readings
  - Standard baud rates: 1200-921600 bps (default: 115200)

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Navigation System                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Primary   │  │  Secondary  │  │      IMU Sensor     │  │
│  │ u-blox GNSS │  │ u-blox GNSS │  │   (WIT-Motion)      │  │
│  │   Receiver  │  │   Receiver  │  │                     │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                    │            │
│         │ Serial/USB     │ Serial/USB         │ Serial/USB │
│         │ NMEA 0183      │ NMEA 0183          │ Binary     │
│         │                │                    │            │
│  ┌──────▼────────────────▼────────────────────▼──────────┐  │
│  │              Data Processing Layer                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │   NMEA      │  │   NMEA      │  │   WIT-Motion │   │  │
│  │  │   Parser    │  │   Parser    │  │   Parser    │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                               │
│  ┌────────────────────────▼─────────────────────────────┐  │
│  │            Sensor Fusion Engine                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │          Kalman Filter                          │  │  │
│  │  │  • Position fusion (x, y, vx, vy)              │  │  │
│  │  │  • Complementary heading filter                 │  │  │
│  │  │  • Dead reckoning capability                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                               │
│  ┌────────────────────────▼─────────────────────────────┐  │
│  │                User Interface                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │   Mapping   │  │ Navigation  │  │    Config   │   │  │
│  │  │   Module    │  │   Module    │  │   Module    │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Hardware Setup

### Physical Connections

```
┌─────────────────────────────────────────────────────────────┐
│                        Boat/Vessel                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Computer/Tablet                      ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │              Navigation System                      │││
│  │  │                                                     │││
│  │  │  USB/Serial Ports:                                  │││
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐  │││
│  │  │  │   COM1  │  │   COM2  │  │        COM3         │  │││
│  │  │  └────┬────┘  └────┬────┘  └──────────┬──────────┘  │││
│  │  │       │            │                  │             │││
│  │  └───────┼────────────┼──────────────────┼─────────────┘││
│  └──────────┼────────────┼──────────────────┼──────────────┘│
│             │            │                  │               │
│             │            │                  │               │
│  ┌──────────▼──┐  ┌──────▼──────┐  ┌───────▼───────────┐   │
│  │   Primary   │  │  Secondary  │  │    IMU Sensor     │   │
│  │ u-blox GNSS │  │ u-blox GNSS │  │   (WIT-Motion)    │   │
│  │   Receiver  │  │   Receiver  │  │                   │   │
│  │             │  │             │  │  ┌─────────────┐  │   │
│  │  • GPS      │  │  • GPS      │  │  │ Accelerom.  │  │   │
│  │  • GLONASS  │  │  • GLONASS  │  │  │ Gyroscope   │  │   │
│  │  • Galileo  │  │  • Galileo  │  │  │ Magnetom.   │  │   │
│  │  • BeiDou   │  │  • BeiDou   │  │  └─────────────┘  │   │
│  └─────────────┘  └─────────────┘  └───────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Mounting Considerations                    ││
│  │  • GNSS receivers: Clear sky view, away from metal     ││
│  │  • IMU sensor: Stable mounting, aligned with vessel    ││
│  │  • Cables: Marine-grade, waterproof connections        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Configuration Requirements

Before first use, configure the following:

1. **Vessel Dimensions**
   - Length, width, draft, and height
   - Used for navigation calculations and display scaling

2. **Primary GNSS Receiver**
   - COM port assignment
   - Baud rate configuration (default: 38400)
   - Enable/disable functionality

3. **Secondary GNSS Receiver** (Optional)
   - COM port assignment
   - Baud rate configuration (default: 38400)
   - Provides redundancy and improved accuracy

4. **IMU Sensor**
   - COM port assignment
   - Baud rate configuration (default: 115200)
   - Calibration settings (compass, gyro, accelerometer)

## 🚀 Getting Started

### Prerequisites

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 18 or higher
- **Hardware**: At least one u-blox GNSS receiver and one WIT-Motion IMU sensor
- **Connections**: USB-to-serial adapters or direct USB connections

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/srk0102/navigation-system.git
   cd navigation-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Mode**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   ```

### First-Time Setup

1. **Launch the Application**
   - The system will start in configuration mode
   - Navigate to the Configuration page

2. **Configure Vessel Information**
   - Enter your boat's dimensions
   - Set appropriate units (feet/meters)

3. **Set Up GNSS Receivers**
   - Connect your u-blox receivers via USB/Serial
   - Select the appropriate COM ports
   - Configure baud rates (38400 recommended)

4. **Configure IMU Sensor**
   - Connect your WIT-Motion IMU sensor
   - Select the appropriate COM port
   - Set baud rate to 115200

5. **Test Connections**
   - Verify all devices are detected
   - Check data flow indicators
   - Confirm position and heading data

## 🗺️ Navigation Features

### Mapping & Waypoints
- Interactive map display using OpenLayers
- Waypoint creation and management
- Route planning and optimization
- Track recording and playback

### Real-time Navigation
- Live position display with accuracy indicators
- Heading and course information
- Speed and distance calculations
- Vessel representation on map

### Data Recording
- Automatic track logging
- Route saving and loading
- Export capabilities for analysis
- Historical navigation data

## 🔧 Technical Specifications

### Data Fusion Algorithm
- **Position Fusion**: 2D Kalman filter (x, y, vx, vy)
- **Heading Fusion**: Complementary filter combining IMU and GPS data
- **Update Rates**: 10Hz position, 20Hz heading
- **Accuracy**: Sub-meter positioning with proper GNSS setup

### Supported Protocols
- **GNSS**: NMEA 0183 (GGA sentences)
- **IMU**: WIT-Motion binary protocol
- **Serial**: Standard RS-232/USB serial communication

### Performance
- **Latency**: <100ms from sensor to display
- **Memory Usage**: Optimized for long-duration navigation
- **CPU Usage**: Efficient processing for extended operation

## 🛠️ Troubleshooting

### Common Issues

1. **Device Not Detected**
   - Check USB/Serial connections
   - Verify COM port availability
   - Ensure proper drivers are installed

2. **No GPS Data**
   - Verify antenna connection and positioning
   - Check NMEA sentence format
   - Confirm baud rate settings

3. **IMU Data Issues**
   - Verify sensor power and connections
   - Check baud rate (115200 recommended)
   - Ensure proper sensor orientation

4. **Poor Accuracy**
   - Verify clear sky view for GNSS receivers
   - Check for electromagnetic interference
   - Ensure proper sensor calibration

### Support

For technical support and questions:
- **Issues**: [GitHub Issues](https://github.com/srk0102/navigation-system/issues)
- **Email**: ramakrishnasiva128@gmail.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This navigation system is intended for recreational and educational purposes. Always use appropriate marine navigation practices and maintain backup navigation systems when operating vessels.