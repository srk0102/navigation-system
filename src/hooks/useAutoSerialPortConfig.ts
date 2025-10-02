import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  vendorId?: string;
  productId?: string;
}

export function useAutoSerialPortConfig() {
  const config = useSelector((state: RootState) => state.config);
  const connectionStatus = useSelector((state: RootState) => state.navigation.connectionStatus);
  const [ports, setPorts] = useState<SerialPortInfo[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Helper to refresh port list
  const refresh = useCallback(async () => {
    try {
      const portList: SerialPortInfo[] = await window.ipcRenderer.navigation.listSerialPorts();
      setPorts(portList);
      const errors: string[] = [];

      // Check if configured IMU port exists or is connected
      if (
        config.imu.port.enabled &&
        config.imu.port.path &&
        !portList.some(p => p.path === config.imu.port.path) &&
        !connectionStatus.imu
      ) {
        errors.push(`Configured IMU port (${config.imu.port.path}) not found`);
      }
      // Check if configured primary GNSS port exists or is connected
      if (
        config.ublox.primary.enabled &&
        config.ublox.primary.path &&
        !portList.some(p => p.path === config.ublox.primary.path) &&
        !connectionStatus.primaryGNSS
      ) {
        errors.push(`Configured primary GNSS port (${config.ublox.primary.path}) not found`);
      }
      // Check if configured secondary GNSS port exists or is connected
      if (
        config.ublox.secondary.enabled &&
        config.ublox.secondary.path &&
        !portList.some(p => p.path === config.ublox.secondary.path) &&
        !connectionStatus.secondaryGNSS
      ) {
        errors.push(`Configured secondary GNSS port (${config.ublox.secondary.path}) not found`);
      }
      setErrors(errors);
    } catch (e: any) {
      setErrors([e.message || 'Failed to list serial ports']);
    }
  }, [config, connectionStatus]);

  useEffect(() => {
    refresh();
    // Optionally, poll every few seconds for hotplug
    // const interval = setInterval(refresh, 5000);
    // return () => clearInterval(interval);
  }, [refresh]);

  return { ports, errors, refresh };
}
