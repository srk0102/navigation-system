"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // Navigation specific APIs
  navigation: {
    /** List all available serial ports */
    listSerialPorts: () => electron.ipcRenderer.invoke("list-serial-ports"),
    /** Connect to a serial port */
    connectToPort: (portPath, baudRate, portType) => electron.ipcRenderer.invoke("connect-to-port", { portPath, baudRate, portType }),
    /** Restart a serial port (disconnect and reconnect) */
    restartPort: (portType) => electron.ipcRenderer.invoke("restart-port", portType),
    /** Get connection status for all ports */
    getConnectionStatus: () => electron.ipcRenderer.invoke("get-connection-status"),
    // Data streaming
    onSerialData: (callback) => {
      electron.ipcRenderer.on("serial-data", (_, data) => callback(data));
    },
    onConnectionStatusUpdate: (callback) => {
      electron.ipcRenderer.on("connection-status-update", (_, status) => callback(status));
    },
    onPositionUpdate: (callback) => {
      electron.ipcRenderer.on("position-update", (_, position) => callback(position));
    },
    onError: (callback) => {
      electron.ipcRenderer.on("navigation-error", (_, error) => callback(error));
    }
  }
});
