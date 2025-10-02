import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // Navigation specific APIs
  navigation: {
    /** List all available serial ports */
    listSerialPorts: () => ipcRenderer.invoke('list-serial-ports'),
    /** Connect to a serial port */
    connectToPort: (portPath: string, baudRate: number, portType: string) => 
      ipcRenderer.invoke('connect-to-port', { portPath, baudRate, portType }),
    /** Restart a serial port (disconnect and reconnect) */
    restartPort: (portType: string) => 
      ipcRenderer.invoke('restart-port', portType),
    /** Get connection status for all ports */
    getConnectionStatus: () => 
      ipcRenderer.invoke('get-connection-status'),
    // Data streaming
    onSerialData: (callback: (data: any) => void) => {
      ipcRenderer.on('serial-data', (_, data) => callback(data));
    },
    onConnectionStatusUpdate: (callback: (status: any) => void) => {
      ipcRenderer.on('connection-status-update', (_, status) => callback(status));
    },
    onPositionUpdate: (callback: (position: any) => void) => {
      ipcRenderer.on('position-update', (_, position) => callback(position));
    },
    onError: (callback: (error: any) => void) => {
      ipcRenderer.on('navigation-error', (_, error) => callback(error));
    },
  }
})
