import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  addWaypoint,
  removeWaypoint,
  clearWaypoints,
  startNavigation,
  stopNavigation,
  updatePosition,
  updateConnectionStatus,
} from "../store/slices/navigationSlice";
import { MapComponent } from "../components/Map";
import { DataProcessor } from "../services/DataProcessor";

export function Navigation() {
  const dispatch = useDispatch();
  const {
    waypoints,
    isNavigating,
    connectionStatus,
    currentPath,
    savedRoutes,
  } = useSelector((state: RootState) => state.navigation);
  const config = useSelector((state: RootState) => state.config);

  const [newWaypoint, setNewWaypoint] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
  });
  // Store the latest fused position in a ref
  const latestFusedPosition = useRef<any>(null);
  // Optionally, use local state for live display
  const [livePosition, setLivePosition] = useState<any>(null);

  // State for individual sensor data
  const [primaryGNSSData, setPrimaryGNSSData] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [secondaryGNSSData, setSecondaryGNSSData] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [imuData, setIMUData] = useState<{
    heading: number;
    elevation: number;
    acceleration: { x: number; y: number; z: number };
    gyroscope: { x: number; y: number; z: number };
  } | null>(null);

  // Use a ref to track the last update time for throttling
  const lastUpdateTimeRef = useRef<number>(0);
  const updateIntervalMs = 100; // Update at most every 100ms for responsive IMU updates

  // Vessel dimensions (would come from settings in a real app)
  const [vesselDimensions, setVesselDimensions] = useState({
    length: 40, // feet
    width: 16, // feet
    color: "#22c55e",
  });

  // create a single DataProcessor instance for this component
  const dataProcessorRef = useRef(new DataProcessor()).current;
  const latest = useRef<{ lat?: number; lon?: number; hdg?: number }>({});

  // Update vessel dimensions from configuration or settings
  useEffect(() => {
    // In a real app, this would come from a configuration service or Redux store
    const savedDimensions = localStorage.getItem("vesselDimensions");
    if (savedDimensions) {
      try {
        const parsedDimensions = JSON.parse(savedDimensions);
        setVesselDimensions({
          length: parsedDimensions.length || 40,
          width: parsedDimensions.width || 16,
          color: parsedDimensions.color || "#22c55e",
        });
      } catch (error) {
        console.error("Failed to parse vessel dimensions:", error);
      }
    }
  }, []);

  // Auto-connect to configured ports when component mounts
  useEffect(() => {
    const autoConnectPorts = async () => {
      try {
        // Connect to IMU if configured
        if (config.imu?.port?.enabled && config.imu?.port?.path) {
          await window.ipcRenderer.navigation.connectToPort(
            config.imu.port.path,
            config.imu.port.baudRate,
            'imu'
          );
        }
      } catch (error) {
        console.error('Auto-connection error:', error);
      }
    };

    // Add a small delay to ensure config is loaded
    setTimeout(autoConnectPorts, 500);
  }, [config.imu.port.enabled, config.imu.port.path, config.imu.port.baudRate]);

  // Updated serial data handler in Navigation.tsx

  useEffect(() => {
    const handleSerialData = (data: any) => {
      if (data.portType === "imu") {
        // Check if this is already processed WIT-Motion data or raw text data
        if (data.data && typeof data.data === 'object' && typeof data.data.heading === 'number') {
          // This is already processed WIT-Motion data
          const imu = data.data;
          if (imu && Number.isFinite(imu.heading)) {
            latest.current.hdg = imu.heading; // <— ONLY heading
            // Update UI state with all IMU data
            setIMUData({
              heading: imu.heading,
              elevation: imu.pitch ?? 0,
              acceleration: imu.acceleration ?? { x: 0, y: 0, z: 0 },
              gyroscope: imu.gyroscope ?? { x: 0, y: 0, z: 0 },
            });
          }
        } else {
          // This is raw text data, process it through DataProcessor
          try {
            const imu = dataProcessorRef.processIMUData(data.data);
            if (imu && Number.isFinite(imu.heading)) {
              latest.current.hdg = imu.heading; // <— ONLY heading
              // optional UI state
              setIMUData({
                heading: imu.heading,
                elevation: imu.pitch ?? 0,
                acceleration: imu.acceleration ?? { x: 0, y: 0, z: 0 },
                gyroscope: imu.gyroscope ?? { x: 0, y: 0, z: 0 },
              });
            }
          } catch (err) {
            console.error("IMU Processing Error:", err);
          }
        }
      }
      if (
        data.portType === "primaryGNSS" ||
        data.portType === "secondaryGNSS"
      ) {
        const isPrimary = data.portType === "primaryGNSS";
        const gps = dataProcessorRef.processGPSData(data.data, isPrimary);
        if (gps && Number.isFinite(gps.latitude) && Number.isFinite(gps.longitude)) {
          if (isPrimary) {
            setPrimaryGNSSData({
              latitude: gps.latitude,
              longitude: gps.longitude,
            });
            latest.current.lat = gps.latitude; // <— ONLY lat
            latest.current.lon = gps.longitude; // <— ONLY lon
          } else {
            setSecondaryGNSSData({
              latitude: gps.latitude,
              longitude: gps.longitude,
            });
            // optional fallback if primary missing:
            if (latest.current.lat == null) {
              latest.current.lat = gps.latitude;
              latest.current.lon = gps.longitude;
            }
          }
        }
      }
    };

    const handleConnectionUpdate = (status: any) => {
      dispatch(updateConnectionStatus(status));
    };

    window.ipcRenderer.navigation.onSerialData(handleSerialData);
    window.ipcRenderer.navigation.onConnectionStatusUpdate(
      handleConnectionUpdate
    );

    return () => {
      window.ipcRenderer.off("serial-data", handleSerialData);
      window.ipcRenderer.off(
        "connection-status-update",
        handleConnectionUpdate
      );
    };
  }, [dispatch, dataProcessorRef]);

  // Update the fused position calculation
  useEffect(() => {
    const currentTime = Date.now();

    // Throttle position updates
    if (currentTime - lastUpdateTimeRef.current < updateIntervalMs) {
      return;
    }
    lastUpdateTimeRef.current = currentTime;

    // Only update if we have valid sensor data
    if (latest.current.lat != null && latest.current.lon != null) {
      const fusedPosition = {
        latitude: latest.current.lat,
        longitude: latest.current.lon,
        heading: latest.current.hdg ?? 0,
        elevation: 0,
        speed: 0, // Will be calculated from position changes if needed
        accuracy: 5, // Default accuracy in meters
      };

      setLivePosition(fusedPosition);
      latestFusedPosition.current = fusedPosition;
    }
  }, [primaryGNSSData, secondaryGNSSData, imuData]);

  // Separate effect to update vessel heading in real-time when IMU data changes
  useEffect(() => {
    if (livePosition && latest.current.hdg !== undefined) {
      const currentTime = Date.now();
      
      // Update heading more frequently for smooth vessel rotation
      if (currentTime - lastUpdateTimeRef.current < 50) { // 20 FPS for heading updates
        return;
      }
      lastUpdateTimeRef.current = currentTime;

      const updatedPosition = {
        ...livePosition,
        heading: latest.current.hdg,
      };

      setLivePosition(updatedPosition);
      latestFusedPosition.current = updatedPosition;
    }
  }, [imuData, livePosition]);

  // When navigation is started, periodically dispatch to Redux (or on stop)
  useEffect(() => {
    let interval: any = null;
    if (isNavigating) {
      interval = setInterval(() => {
        if (latestFusedPosition.current) {
          dispatch(
            updatePosition({
              ...latestFusedPosition.current,
              timestamp: new Date().toISOString(),
            })
          );
        }
      }, 1000); // e.g., update Redux every 1s while navigating
    } else {
      // On stop, push the last position
      if (latestFusedPosition.current) {
        dispatch(
          updatePosition({
            ...latestFusedPosition.current,
            timestamp: new Date().toISOString(),
          })
        );
      }
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating, dispatch]);

  // Prepare map props using useMemo to prevent unnecessary re-renders

  const mapWaypoints = React.useMemo(() => {
    return waypoints.map((wp) => ({
      id: wp.id,
      name: wp.name,
      latitude: wp.latitude,
      longitude: wp.longitude,
    }));
  }, [waypoints]);

  const mapTracks = React.useMemo(() => {
    if (currentPath && currentPath.trackPoints.length > 1) {
      return [
        {
          points: currentPath.trackPoints.map((p) => ({
            latitude: p.latitude,
            longitude: p.longitude,
          })),
          color: "#22c55e",
          width: 3,
        },
      ];
    }
    return [];
  }, [currentPath]);

  const currentPositionForMap = React.useMemo(() => {
    if (livePosition) {
      return {
        latitude: livePosition.latitude,
        longitude: livePosition.longitude,
        heading: livePosition.heading,
      };
    }
    return undefined;
  }, [livePosition]);

  const handleAddWaypoint = () => {
    if (newWaypoint.name && newWaypoint.latitude && newWaypoint.longitude) {
      dispatch(addWaypoint(newWaypoint));
      setNewWaypoint({ name: "", latitude: 0, longitude: 0 });
    }
  };

  const handleRemoveWaypoint = (id: string) => {
    dispatch(removeWaypoint(id));
  };

  const handleToggleNavigation = () => {
    if (isNavigating) {
      dispatch(stopNavigation());
    } else {
      dispatch(startNavigation());
    }
  };

  const handleExportRoute = () => {
    // Export the last saved route or current path
    const routeToExport =
      savedRoutes.length > 0
        ? savedRoutes[savedRoutes.length - 1]
        : currentPath;

    if (!routeToExport) {
      alert(
        "No route to export. Please start and stop navigation to record a path."
      );
      return;
    }

    const routeData = {
      id: routeToExport.id,
      name: routeToExport.name,
      startTime: routeToExport.startTime,
      endTime: routeToExport.endTime,
      waypoints: routeToExport.waypoints,
      trackPoints: routeToExport.trackPoints,
      distance: routeToExport.distance,
      duration: routeToExport.duration,
      // include sensor message log for playback/analysis
      sensorLog: [],
      statistics: {
        totalPoints: routeToExport.trackPoints.length,
        avgSpeed:
          routeToExport.trackPoints.length > 0
            ? routeToExport.trackPoints.reduce((sum, p) => sum + p.speed, 0) /
              routeToExport.trackPoints.length
            : 0,
        maxSpeed:
          routeToExport.trackPoints.length > 0
            ? Math.max(...routeToExport.trackPoints.map((p) => p.speed))
            : 0,
      },
    };

    const dataStr = JSON.stringify(routeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${routeToExport.name.replace(/\s/g, "-")}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        {/* Current Position */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Current Position
          </h2>
          {livePosition ? (
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Latitude:
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {livePosition.latitude.toFixed(6)}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Longitude:
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {livePosition.longitude.toFixed(6)}°
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Heading:
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
                    <div 
                      className="w-1 h-3 bg-red-500 rounded-full"
                      style={{ transform: `rotate(${livePosition.heading}deg)` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold text-lg">
                    {livePosition.heading.toFixed(1)}°
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Elevation:
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {livePosition.elevation.toFixed(1)}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Speed:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {livePosition.speed.toFixed(1)} kn
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Accuracy:
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  ±{livePosition.accuracy.toFixed(1)}m
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No position data
            </p>
          )}
        </div>

        {/* Connection Status */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Connection Status
          </h2>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Primary GNSS:
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  connectionStatus.primaryGNSS
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {connectionStatus.primaryGNSS ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Secondary GNSS:
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  connectionStatus.secondaryGNSS
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {connectionStatus.secondaryGNSS ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                IMU Sensor:
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  connectionStatus.imu
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {connectionStatus.imu ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>

        {/* IMU Sensor Data */}
        {imuData && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              IMU Sensor Data
            </h2>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Heading:</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {imuData.heading.toFixed(1)}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Pitch:</span>
                <span className="text-gray-900 dark:text-white">
                  {imuData.elevation.toFixed(1)}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Roll:</span>
                <span className="text-gray-900 dark:text-white">
                  {imuData.gyroscope?.x?.toFixed(1) || '0.0'}°
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-gray-500">Accel X</div>
                  <div className="font-mono">{imuData.acceleration?.x?.toFixed(2) || '0.00'}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500">Accel Y</div>
                  <div className="font-mono">{imuData.acceleration?.y?.toFixed(2) || '0.00'}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500">Accel Z</div>
                  <div className="font-mono">{imuData.acceleration?.z?.toFixed(2) || '0.00'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Control */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={handleToggleNavigation}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              isNavigating
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isNavigating ? "Stop Navigation" : "Start Navigation"}
          </button>
          <button
            onClick={handleExportRoute}
            disabled={waypoints.length === 0}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              waypoints.length > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            Export Route
          </button>
        </div>

        {/* Add Waypoint */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Add Waypoint
          </h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Waypoint Name"
              value={newWaypoint.name}
              onChange={(e) =>
                setNewWaypoint({ ...newWaypoint, name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              step="0.000001"
              placeholder="Latitude"
              value={newWaypoint.latitude || ""}
              onChange={(e) =>
                setNewWaypoint({
                  ...newWaypoint,
                  latitude: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              step="0.000001"
              placeholder="Longitude"
              value={newWaypoint.longitude || ""}
              onChange={(e) =>
                setNewWaypoint({
                  ...newWaypoint,
                  longitude: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleAddWaypoint}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Add Waypoint
            </button>
          </div>
        </div>

        {/* Waypoints List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Waypoints ({waypoints.length})
              </h2>
              {waypoints.length > 0 && (
                <button
                  onClick={() => dispatch(clearWaypoints())}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Clear All
                </button>
              )}
            </div>

            {waypoints.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No waypoints added
              </p>
            ) : (
              <div className="space-y-2">
                {waypoints.map((waypoint, index) => (
                  <div
                    key={waypoint.id}
                    className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {waypoint.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveWaypoint(waypoint.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="text-xs font-mono space-y-0.5 text-gray-600 dark:text-gray-400">
                      <div>Lat: {waypoint.latitude.toFixed(6)}°</div>
                      <div>Lon: {waypoint.longitude.toFixed(6)}°</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapComponent
          center={
            livePosition
              ? {
                  latitude: livePosition.latitude,
                  longitude: livePosition.longitude,
                }
              : undefined
          }
          zoom={livePosition ? 15 : 2}
          waypoints={mapWaypoints}
          tracks={mapTracks}
          showCurrentPosition={!!livePosition}
          currentPosition={currentPositionForMap}
          vesselDimensions={vesselDimensions}
        />

        {/* Map overlay - Navigation status */}
        {isNavigating && (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <span className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="font-semibold">Navigation Active</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
