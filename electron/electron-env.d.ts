/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: {
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => void
    off: (channel: string, listener: (event: any, ...args: any[]) => void) => void
    send: (channel: string, ...args: any[]) => void
    invoke: (channel: string, ...args: any[]) => Promise<any>
    navigation: {
      listSerialPorts: () => Promise<SerialPortInfo[]>
      connectToPort: (portPath: string, baudRate: number, portType: string) => Promise<{ success: boolean; portType: string }>
      disconnectPort: (portType: string) => Promise<{ success: boolean; error?: string }>
      getConnectionStatus: () => Promise<ConnectionStatus>
      onSerialData: (callback: (data: SerialData) => void) => void
      onConnectionStatusUpdate: (callback: (status: ConnectionStatus) => void) => void
      onPositionUpdate: (callback: (position: Position) => void) => void
      onError: (callback: (error: any) => void) => void
    }
  }
}

interface SerialPortInfo {
  path: string
  manufacturer?: string
  serialNumber?: string
  pnpId?: string
  locationId?: string
  vendorId?: string
  productId?: string
}

interface ConnectionStatus {
  primaryGNSS: boolean
  secondaryGNSS: boolean
  imu: boolean
}

interface SerialData {
  portType: 'imu' | 'primaryGNSS' | 'secondaryGNSS'
  data: string
  timestamp: string
}

interface Position {
  latitude: number
  longitude: number
  heading: number
  elevation: number
  speed: number
  accuracy: number
  timestamp: Date
}
