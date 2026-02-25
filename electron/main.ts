// main.ts
import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import installExtension, { REDUX_DEVTOOLS } from "electron-devtools-installer";

const require = createRequire(import.meta.url);
const { SerialPort } = require("serialport");
const { ipcMain } = require("electron");

// Import the WIT-Motion parser
import { WitMotionParser } from "./WitMotionParser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = !app.isPackaged || process.env.NODE_ENV === "development";

process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null = null;

app.commandLine.appendSwitch("disable-usb-blocklist");

// Serial port management
const openPorts = {
  imu: null,
  primaryGNSS: null,
  secondaryGNSS: null,
};

// WIT-Motion parser for IMU data
const witMotionParser = new WitMotionParser((witData: any) => {
  const processed = WitMotionParser.processWitMotionData(witData);
  if (processed && win) {
    win.webContents.send("serial-data", {
      portType: "imu",
      data: processed,
      timestamp: new Date().toISOString(),
    });
  }
});

const portStatus = {
  imu: false,
  primaryGNSS: false,
  secondaryGNSS: false,
};

function getPortByType(type: string) {
  return openPorts[type as keyof typeof openPorts] || null;
}
function setPortByType(type: string, port: any) {
  openPorts[type as keyof typeof openPorts] = port;
}
function setPortStatus(type: string, status: boolean) {
  portStatus[type as keyof typeof portStatus] = status;
  if (win) win.webContents.send("connection-status-update", portStatus);
}

function setupPortHandlers(port: any, portType: string) {
  // Buffer for accumulating partial NMEA lines per port
  let nmeaBuffer = "";
  // Store latest RMC data (speed/COG) to merge with GGA
  let latestRMC: { speed?: number; heading?: number } = {};

  port.on("data", (data: any) => {
    if (portType === "primaryGNSS" || portType === "secondaryGNSS") {
      // Accumulate data in buffer to handle partial lines
      nmeaBuffer += data.toString();
      const lines = nmeaBuffer.split(/\r?\n/);
      // Keep the last partial line in buffer
      nmeaBuffer = lines.pop() || "";

      lines.forEach((line: any) => {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("$")) return;

        // Parse RMC sentences for speed (SOG) and course (COG)
        if (trimmed.startsWith("$GNRMC") || trimmed.startsWith("$GPRMC")) {
          const parts = trimmed.split(",");
          // RMC: $xxRMC,time,status,lat,N,lon,W,speedKnots,cogTrue,date,...
          if (parts.length > 8 && parts[2] === "A") { // A = valid fix
            const speedKnots = parseFloat(parts[7]);
            const cogDeg = parseFloat(parts[8]);
            if (Number.isFinite(speedKnots)) {
              latestRMC.speed = speedKnots * 0.514444; // knots to m/s
            }
            if (Number.isFinite(cogDeg)) {
              latestRMC.heading = cogDeg;
            }
          }
        }

        // Parse GGA sentences for position + quality + accuracy
        if (trimmed.startsWith("$GNGGA") || trimmed.startsWith("$GPGGA")) {
          const parts = trimmed.split(",");
          // GGA: $xxGGA,time,lat,N,lon,W,quality,sats,hdop,alt,M,...
          if (parts.length > 9) {
            const latRaw = parts[2];
            const latDir = parts[3];
            const lonRaw = parts[4];
            const lonDir = parts[5];
            const quality = parseInt(parts[6]) || 0;
            const satellites = parseInt(parts[7]) || 0;
            const hdop = parseFloat(parts[8]) || 99;
            const altitude = parseFloat(parts[9]) || 0;

            if (latRaw && lonRaw && quality > 0) { // Only send if valid fix
              const latDeg = parseFloat(latRaw.slice(0, 2));
              const latMin = parseFloat(latRaw.slice(2));
              const lonDeg = parseFloat(lonRaw.slice(0, 3));
              const lonMin = parseFloat(lonRaw.slice(3));
              let latitude = latDeg + latMin / 60;
              let longitude = lonDeg + lonMin / 60;
              if (latDir === "S") latitude = -latitude;
              if (lonDir === "W") longitude = -longitude;

              const gnssData = {
                portType,
                data: {
                  latitude,
                  longitude,
                  altitude,
                  quality,
                  satellites,
                  hdop,
                  // Merge speed/COG from latest RMC sentence
                  speed: latestRMC.speed,
                  heading: latestRMC.heading,
                  raw: trimmed,
                },
                timestamp: new Date().toISOString(),
              };
              if (win) win.webContents.send("serial-data", gnssData);
            }
          }
        }
      });
    } else if (portType === "imu") {
      // Process IMU data through WIT-Motion parser
      witMotionParser.push(data);
    } else {
      // Other port types: forward as-is
      if (win)
        win.webContents.send("serial-data", {
          portType,
          data: data.toString(),
          timestamp: new Date().toISOString(),
        });
    }
  });

  port.on("close", () => setPortStatus(portType, false));
  port.on("error", (err: any) => {
    setPortStatus(portType, false);
    if (win)
      win.webContents.send(
        "navigation-error",
        `${portType} error: ${err.message}`
      );
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 2000,
    height: 980,
    icon: path.join(process.env.VITE_PUBLIC!, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      devTools: isDev,
    },
  });

  // --- USB Permission and Device Handlers ---
  let grantedDeviceThroughPermHandler: any = undefined;
  const ses = win.webContents.session;

  ses.on("select-usb-device", (_event, details, callback) => {
    ses.on("usb-device-added", (_event, device) => {
      console.log("usb-device-added FIRED WITH", device);
    });
    ses.on("usb-device-removed", (_event, device) => {
      console.log("usb-device-removed FIRED WITH", device);
    });
    _event.preventDefault();
    if (details.deviceList && details.deviceList.length > 0) {
      const deviceToReturn = details.deviceList.find((device) => {
        return (
          !grantedDeviceThroughPermHandler ||
          device.deviceId !== grantedDeviceThroughPermHandler.deviceId
        );
      });
      if (deviceToReturn) {
        callback(deviceToReturn.deviceId);
      } else {
        callback();
      }
    }
  });

  ses.setPermissionCheckHandler(
    (_webContents, permission, _requestingOrigin, details) => {
      if (permission === "usb" && details.securityOrigin === "file:///") {
        return true;
      }
      return false;
    }
  );

  ses.setDevicePermissionHandler((details) => {
    if (details.deviceType === "usb" && details.origin === "file://") {
      if (!grantedDeviceThroughPermHandler) {
        grantedDeviceThroughPermHandler = details.device;
        return true;
      } else {
        return false;
      }
    }
    return false;
  });

  ses.setUSBProtectedClassesHandler((details) => {
    return details.protectedClasses.filter((usbClass) => {
      // Exclude classes except for audio classes
      return usbClass.indexOf("audio") === -1;
    });
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
    // ✅ Open devtools only in dev
    if (isDev) win?.webContents.openDevTools();
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(async () => {
  // ✅ Only install Redux DevTools in dev
  if (isDev) {
    try {
      await installExtension(REDUX_DEVTOOLS, {
        loadExtensionOptions: { allowFileAccess: true },
        forceDownload: true,
      });
      console.log("Redux DevTools installed");
    } catch (e) {
      console.error("Redux DevTools install failed:", e);
    }
  }

  createWindow();
});

// Register IPC handler for listing serial ports
ipcMain.handle("list-serial-ports", async () => {
  try {
    return await SerialPort.list();
  } catch (e) {
    return [];
  }
});

ipcMain.handle(
  "connect-to-port",
  async (_event: any, { portPath, baudRate, portType }: { portPath: string, baudRate: number, portType: string }) => {
    try {
      
      // Close previous port if open
      const oldPort = getPortByType(portType);
      if (oldPort && (oldPort as any).isOpen) {
        await new Promise((res) => (oldPort as any).close(res));
      }

      const port = new SerialPort({
        path: portPath,
        baudRate,
        autoOpen: false,
      });


      port.open((err: any) => {
        if (err) {
          setPortStatus(portType, false);
          if (win)
            win.webContents.send(
              "navigation-error",
              `${portType} open error: ${err.message}`
            );
          return;
        }
        setPortStatus(portType, true);
      });

      // Set up port handlers
      setupPortHandlers(port, portType);


      setPortByType(portType, port);
      return { success: true, portType };
    } catch (e: any) {
      setPortStatus(portType, false);
      if (win)
        win.webContents.send(
          "navigation-error",
          `${portType} connect error: ${e.message}`
        );
      return { success: false, portType, error: e.message };
    }
  }
);

ipcMain.handle("restart-port", async (_event: any, portType: string) => {
  try {
    const port = getPortByType(portType);
    if (port && (port as any).isOpen) {
      await new Promise((res) => (port as any).close(res));
    }
    setPortByType(portType, null);
    setPortStatus(portType, false);
    // Optionally, you could auto-reconnect here if you want
    return { success: true };
  } catch (e: any) {
    if (win)
      win.webContents.send(
        "navigation-error",
        `${portType} restart error: ${e.message}`
      );
    return { success: false, error: e.message };
  }
});

ipcMain.handle("get-connection-status", () => {
  return portStatus;
});
