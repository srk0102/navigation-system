import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface BoatDimensions {
  length: number // in meters
  width: number // in meters
  draft: number // in meters
  height: number // in meters
}

export interface SerialPortConfig {
  path: string
  baudRate: number
  enabled: boolean
}

export interface UbloxConfig {
  primary: SerialPortConfig
  secondary: SerialPortConfig
}

export interface ImuConfig {
  port: SerialPortConfig
  headingOffset: number // degrees to add to IMU heading for mounting correction
  calibration: {
    compass: boolean
    gyro: boolean
    accelerometer: boolean
  }
}

export interface NavigationConfig {
  boatDimensions: BoatDimensions
  ublox: UbloxConfig
  imu: ImuConfig
  isConfigured: boolean
}

// Helper to convert feet to meters
const feetToMeters = (feet: number): number => feet * 0.3048

// Load from localStorage on initialization
const loadConfigFromStorage = (): NavigationConfig => {
  const defaultState: NavigationConfig = {
    boatDimensions: {
      length: feetToMeters(40), // 40 feet = ~12.19 meters
      width: feetToMeters(16), // 16 feet = ~4.88 meters
      draft: feetToMeters(4), // 4 feet = ~1.22 meters (reasonable default)
      height: feetToMeters(8), // 8 feet = ~2.44 meters (reasonable default)
    },
    ublox: {
      primary: {
        path: '',
        baudRate: 38400, // Common u-blox default
        enabled: false,
      },
      secondary: {
        path: '',
        baudRate: 38400, // Common u-blox default
        enabled: false,
      },
    },
    imu: {
      port: {
        path: '',
        baudRate: 115200, // Common IMU default
        enabled: false,
      },
      headingOffset: 0, // degrees
      calibration: {
        compass: false,
        gyro: false,
        accelerometer: false,
      },
    },
    isConfigured: false,
  }

  try {
    const stored = localStorage.getItem('navigation-config')
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...defaultState,
        ...parsed,
        isConfigured: parsed.isConfigured || false,
      }
    }
  } catch (error) {
    console.error('Failed to load config from localStorage:', error)
  }
  return defaultState
}

const initialState: NavigationConfig = loadConfigFromStorage()

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateBoatDimensions: (state, action: PayloadAction<Partial<BoatDimensions>>) => {
      state.boatDimensions = { ...state.boatDimensions, ...action.payload }
      state.isConfigured = checkIfConfigured(state)
    },
    updateUbloxPrimary: (state, action: PayloadAction<Partial<SerialPortConfig>>) => {
      state.ublox.primary = { ...state.ublox.primary, ...action.payload }
      state.isConfigured = checkIfConfigured(state)
    },
    updateUbloxSecondary: (state, action: PayloadAction<Partial<SerialPortConfig>>) => {
      state.ublox.secondary = { ...state.ublox.secondary, ...action.payload }
      state.isConfigured = checkIfConfigured(state)
    },
    updateImuPort: (state, action: PayloadAction<Partial<SerialPortConfig>>) => {
      state.imu.port = { ...state.imu.port, ...action.payload }
      state.isConfigured = checkIfConfigured(state)
    },
    updateImuCalibration: (state, action: PayloadAction<Partial<ImuConfig['calibration']>>) => {
      state.imu.calibration = { ...state.imu.calibration, ...action.payload }
    },
    setConfigured: (state, action: PayloadAction<boolean>) => {
      state.isConfigured = action.payload
    },
    resetConfig: () => initialState,
    saveToStorage: (state) => {
      try {
        localStorage.setItem('navigation-config', JSON.stringify(state))
      } catch (error) {
        console.error('Failed to save config to localStorage:', error)
      }
    },
    loadFromStorage: () => loadConfigFromStorage(),
  },
})

// Helper function to check if configuration is complete
// Only checks COM ports, not boat dimensions (dimensions have defaults)
function checkIfConfigured(config: NavigationConfig): boolean {
  const { ublox, imu } = config
  
  // Check at least one u-blox receiver is configured with a port
  const ubloxConfigured = 
    (ublox.primary.enabled && ublox.primary.path.length > 0) ||
    (ublox.secondary.enabled && ublox.secondary.path.length > 0)
  
  // Check IMU is configured with a port
  const imuConfigured = imu.port.enabled && imu.port.path.length > 0
  
  return ubloxConfigured && imuConfigured
}

// Helper function to get missing configuration sections
export function getMissingConfig(config: NavigationConfig): string[] {
  const missing: string[] = []
  const { ublox, imu } = config
  
  // Check u-blox receivers
  const ubloxConfigured = 
    (ublox.primary.enabled && ublox.primary.path.length > 0) ||
    (ublox.secondary.enabled && ublox.secondary.path.length > 0)
  
  if (!ubloxConfigured) {
    missing.push('U-blox GNSS Receivers: Please configure at least one receiver with a COM port')
  }
  
  // Check IMU
  const imuConfigured = imu.port.enabled && imu.port.path.length > 0
  if (!imuConfigured) {
    missing.push('IMU Sensor: Please configure the IMU sensor with a COM port')
  }
  
  return missing
}

export const {
  updateBoatDimensions,
  updateUbloxPrimary,
  updateUbloxSecondary,
  updateImuPort,
  updateImuCalibration,
  setConfigured,
  resetConfig,
  saveToStorage,
  loadFromStorage,
} = configSlice.actions

export default configSlice.reducer
