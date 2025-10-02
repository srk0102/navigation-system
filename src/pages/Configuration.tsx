import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import {
  updateBoatDimensions,
  updateUbloxPrimary,
  updateUbloxSecondary,
  updateImuPort,
  updateImuCalibration,
  getMissingConfig,
} from '../store/slices/configSlice'
import { updateConnectionStatus } from '../store/slices/navigationSlice'
import { useAutoSerialPortConfig } from '../hooks/useAutoSerialPortConfig';

import { BAUD_RATES } from '../constants'

// Conversion helpers
const metersToFeet = (meters: number): number => meters / 0.3048
const feetToMeters = (feet: number): number => feet * 0.3048

export function Configuration() {
  const dispatch = useDispatch()
  const config = useSelector((state: RootState) => state.config)
  const connectionStatus = useSelector((state: RootState) => state.navigation.connectionStatus);
  const [activeTab, setActiveTab] = useState<'boat' | 'ublox' | 'imu'>('ublox')
  const missingConfig = getMissingConfig(config)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [testingPort, setTestingPort] = useState<string | null>(null)
  const { ports, errors } = useAutoSerialPortConfig();
  // Load available serial ports on component mount
  useEffect(() => {
    const loadPorts = async () => {
      try {
        const ports = await window.ipcRenderer.navigation.listSerialPorts()
        console.log('Available serial ports:', ports)
      } catch (error) {
        console.error('Failed to load serial ports:', error)
      }
    }
    loadPorts()
  }, [])

  // Listen for connection status updates
  useEffect(() => {
    const handleConnectionUpdate = (status: any) => {
      dispatch(updateConnectionStatus(status))
    }

    window.ipcRenderer.navigation.onConnectionStatusUpdate(handleConnectionUpdate)
    
    return () => {
      window.ipcRenderer.off('connection-status-update', handleConnectionUpdate)
    }
  }, [dispatch])

  const handleBoatDimensionsChange = (field: string, feetValue: number) => {
    // Convert feet to meters before storing
    dispatch(updateBoatDimensions({ [field]: feetToMeters(feetValue) }))
  }

  const handleUbloxPrimaryChange = (field: string, value: string | number | boolean) => {
    dispatch(updateUbloxPrimary({ [field]: value }))
  }

  const handleUbloxSecondaryChange = (field: string, value: string | number | boolean) => {
    dispatch(updateUbloxSecondary({ [field]: value }))
  }

  const handleImuPortChange = (field: string, value: string | number | boolean) => {
    dispatch(updateImuPort({ [field]: value }))
  }

  const handleImuCalibrationChange = (field: string, value: boolean) => {
    dispatch(updateImuCalibration({ [field]: value }))
  }

  const handleSave = () => {
    setSaveStatus('saving')
    // Save to localStorage is handled automatically by Redux middleware
    // Simulate save delay for UX
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 300)
  }

  const handleTestPort = async (portType: 'primary' | 'secondary' | 'imu') => {
    setTestingPort(portType)
    
    try {
      let portPath = ''
      let baudRate = 0
      
      if (portType === 'primary') {
        portPath = config.ublox.primary.path
        baudRate = config.ublox.primary.baudRate
      } else if (portType === 'secondary') {
        portPath = config.ublox.secondary.path
        baudRate = config.ublox.secondary.baudRate
      } else if (portType === 'imu') {
        portPath = config.imu.port.path
        baudRate = config.imu.port.baudRate
      }

      if (!portPath) {
        alert(`Please configure ${portType} port path first`)
        setTestingPort(null)
        return
      }

      const result = await window.ipcRenderer.navigation.connectToPort(
        portPath, 
        baudRate, 
        portType === 'primary' ? 'primaryGNSS' : portType === 'secondary' ? 'secondaryGNSS' : 'imu'
      )
      
      if (result.success) {
        alert(`${portType} port connected successfully!`)
      } else {
        alert(`Failed to connect to ${portType} port`)
      }
    } catch (error) {
      console.error(`Error testing ${portType} port:`, error)
      alert(`Error testing ${portType} port: ${error}`)
    } finally {
      setTestingPort(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            System Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Configure your boat dimensions and sensor connections
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            saveStatus === 'saved'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : saveStatus === 'saving'
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {saveStatus === 'saving' && (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Saved!
            </span>
          )}
          {saveStatus === 'idle' && 'Save Configuration'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'boat', name: 'Boat Dimensions', icon: '🚤' },
            { id: 'ublox', name: 'U-blox Receivers', icon: '📡' },
            { id: 'imu', name: 'IMU Sensor', icon: '🧭' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'boat' | 'ublox' | 'imu')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Boat Dimensions Tab */}
      {activeTab === 'boat' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Boat Dimensions (in feet)
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Length (feet)
              </label>
              <input
                type="number"
                step="0.5"
                value={Math.round(metersToFeet(config.boatDimensions.length) * 10) / 10}
                onChange={(e) => handleBoatDimensionsChange('length', parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {config.boatDimensions.length.toFixed(2)} meters
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Width (feet)
              </label>
              <input
                type="number"
                step="0.5"
                value={Math.round(metersToFeet(config.boatDimensions.width) * 10) / 10}
                onChange={(e) => handleBoatDimensionsChange('width', parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {config.boatDimensions.width.toFixed(2)} meters
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Draft (feet)
              </label>
              <input
                type="number"
                step="0.5"
                value={Math.round(metersToFeet(config.boatDimensions.draft) * 10) / 10}
                onChange={(e) => handleBoatDimensionsChange('draft', parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {config.boatDimensions.draft.toFixed(2)} meters
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Height (feet)
              </label>
              <input
                type="number"
                step="0.5"
                value={Math.round(metersToFeet(config.boatDimensions.height) * 10) / 10}
                onChange={(e) => handleBoatDimensionsChange('height', parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {config.boatDimensions.height.toFixed(2)} meters
              </p>
            </div>
          </div>
        </div>
      )}

      {/* U-blox Receivers Tab */}
      {activeTab === 'ublox' && (
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            U-blox GNSS Receivers
          </h2>
          
          {/* Primary Receiver */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Primary Receiver
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Port Path
                </label>
                {ports.length === 0 ? (
                  <>
                    <div className="text-gray-500 text-sm mb-1">Scanning ports, please wait...</div>
                    <input
                      type="text"
                      value={config.ublox.primary.path}
                      onChange={e => handleUbloxPrimaryChange('path', e.target.value)}
                      placeholder="Enter port path manually (e.g., COM12)"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                    />
                  </>
                ) : (
                  <>
                    <select
                      value={ports.some(p => p.path === config.ublox.primary.path) ? config.ublox.primary.path : 'manual'}
                      onChange={e => {
                        if (e.target.value === 'manual') {
                          handleUbloxPrimaryChange('path', '');
                        } else {
                          handleUbloxPrimaryChange('path', e.target.value);
                        }
                      }}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                    >
                      <option value="">Select a port...</option>
                      {ports.map(p => (
                        <option key={p.path} value={p.path}>{p.path}</option>
                      ))}
                      <option value="manual">Enter manually...</option>
                    </select>
                    {(!ports.some(p => p.path === config.ublox.primary.path) && config.ublox.primary.path) && (
                      <input
                        type="text"
                        value={config.ublox.primary.path}
                        onChange={e => handleUbloxPrimaryChange('path', e.target.value)}
                        placeholder="Enter port path manually (e.g., COM12)"
                        className="mt-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                      />
                    )}
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Baud Rate
                </label>
                <select
                  value={config.ublox.primary.baudRate}
                  onChange={(e) => handleUbloxPrimaryChange('baudRate', parseInt(e.target.value))}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                >
                  {BAUD_RATES.map(rate => (
                    <option key={rate} value={rate}>{rate}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.ublox.primary.enabled}
                    onChange={(e) => handleUbloxPrimaryChange('enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Enable Primary Receiver
                  </span>
                </label>
                <button
                  onClick={() => handleTestPort('primary')}
                  disabled={!config.ublox.primary.enabled || !config.ublox.primary.path || testingPort === 'primary'}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    testingPort === 'primary'
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : config.ublox.primary.enabled && config.ublox.primary.path
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  }`}
                >
                  {testingPort === 'primary' ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Testing...
                    </span>
                  ) : (
                    'Test Connection'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Receiver */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Secondary Receiver
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Port Path
                </label>
                {ports.length === 0 ? (
                  <>
                    <div className="text-gray-500 text-sm mb-1">Scanning ports, please wait...</div>
                    <input
                      type="text"
                      value={config.ublox.secondary.path}
                      onChange={e => handleUbloxSecondaryChange('path', e.target.value)}
                      placeholder="Enter port path manually (e.g., COM7)"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                    />
                  </>
                ) : (
                  <>
                    <select
                      value={ports.some(p => p.path === config.ublox.secondary.path) ? config.ublox.secondary.path : 'manual'}
                      onChange={e => {
                        if (e.target.value === 'manual') {
                          handleUbloxSecondaryChange('path', '');
                        } else {
                          handleUbloxSecondaryChange('path', e.target.value);
                        }
                      }}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                    >
                      <option value="">Select a port...</option>
                      {ports.map(p => (
                        <option key={p.path} value={p.path}>{p.path}</option>
                      ))}
                      <option value="manual">Enter manually...</option>
                    </select>
                    {(!ports.some(p => p.path === config.ublox.secondary.path) && config.ublox.secondary.path) && (
                      <input
                        type="text"
                        value={config.ublox.secondary.path}
                        onChange={e => handleUbloxSecondaryChange('path', e.target.value)}
                        placeholder="Enter port path manually (e.g., COM7)"
                        className="mt-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                      />
                    )}
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Baud Rate
                </label>
                <select
                  value={config.ublox.secondary.baudRate}
                  onChange={(e) => handleUbloxSecondaryChange('baudRate', parseInt(e.target.value))}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                >
                  {BAUD_RATES.map(rate => (
                    <option key={rate} value={rate}>{rate}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.ublox.secondary.enabled}
                    onChange={(e) => handleUbloxSecondaryChange('enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Enable Secondary Receiver
                  </span>
                </label>
                <button
                  onClick={() => handleTestPort('secondary')}
                  disabled={!config.ublox.secondary.enabled || !config.ublox.secondary.path || testingPort === 'secondary'}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    testingPort === 'secondary'
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : config.ublox.secondary.enabled && config.ublox.secondary.path
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  }`}
                >
                  {testingPort === 'secondary' ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Testing...
                    </span>
                  ) : (
                    'Test Connection'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMU Sensor Tab */}
      {activeTab === 'imu' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            IMU Sensor Configuration
          </h2>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              IMU Port Configuration
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Port Path
                </label>
                {ports.length === 0 ? (
                  <>
                    <div className="text-gray-500 text-sm mb-1">Scanning ports, please wait...</div>
                    <input
                      type="text"
                      value={config.imu.port.path}
                      onChange={e => handleImuPortChange('path', e.target.value)}
                      placeholder="Enter port path manually (e.g., COM13)"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                    />
                  </>
                ) : (
                  <>
                    <select
                      value={ports.some(p => p.path === config.imu.port.path) ? config.imu.port.path : 'manual'}
                      onChange={e => {
                        if (e.target.value === 'manual') {
                          handleImuPortChange('path', '');
                        } else {
                          handleImuPortChange('path', e.target.value);
                        }
                      }}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                    >
                      <option value="">Select a port...</option>
                      {ports.map(p => (
                        <option key={p.path} value={p.path}>{p.path}</option>
                      ))}
                      <option value="manual">Enter manually...</option>
                    </select>
                    {(!ports.some(p => p.path === config.imu.port.path) && config.imu.port.path) && (
                      <input
                        type="text"
                        value={config.imu.port.path}
                        onChange={e => handleImuPortChange('path', e.target.value)}
                        placeholder="Enter port path manually (e.g., COM13)"
                        className="mt-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                      />
                    )}
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Baud Rate
                </label>
                <select
                  value={config.imu.port.baudRate}
                  onChange={(e) => handleImuPortChange('baudRate', parseInt(e.target.value))}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
                >
                  {BAUD_RATES.map(rate => (
                    <option key={rate} value={rate}>{rate}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.imu.port.enabled}
                    onChange={(e) => handleImuPortChange('enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Enable IMU Sensor
                  </span>
                </label>
                <button
                  onClick={() => handleTestPort('imu')}
                  disabled={!config.imu.port.enabled || !config.imu.port.path || testingPort === 'imu'}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    testingPort === 'imu'
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : config.imu.port.enabled && config.imu.port.path
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  }`}
                >
                  {testingPort === 'imu' ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Testing...
                    </span>
                  ) : (
                    'Test Connection'
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Calibration Status
            </h3>
            <div className="space-y-3">
              {[
                { key: 'compass', label: 'Compass Calibration' },
                { key: 'gyro', label: 'Gyroscope Calibration' },
                { key: 'accelerometer', label: 'Accelerometer Calibration' },
              ].map((item) => (
                <label key={item.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.imu.calibration[item.key as keyof typeof config.imu.calibration]}
                    onChange={(e) => handleImuCalibrationChange(item.key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Configuration Status */}
      <div className={`mt-8 p-4 rounded-lg ${
        config.isConfigured 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
          : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
      }`}>
        <div className="flex items-start">
          <div className={`w-3 h-3 rounded-full mr-3 mt-1 ${config.isConfigured ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {config.isConfigured ? 'Configuration Complete' : 'Configuration Incomplete'}
            </span>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {config.isConfigured 
                ? 'All required settings have been configured. You can now use the navigation system.'
                : 'Please complete the following required settings:'
              }
            </p>
            {!config.isConfigured && missingConfig.length > 0 && (
              <ul className="mt-3 space-y-2">
                {missingConfig.map((error, index) => (
                  <li key={index} className="flex items-start text-sm text-red-600 dark:text-red-400">
                    <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {errors.length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">Errors:</h3>
          <ul className="list-disc list-inside text-red-600 dark:text-red-400">
            {errors.map((err, idx) => <li key={idx}>{err}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
