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
  addTrackPoint,
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

  // Removed newWaypoint state - no longer needed since we auto-generate waypoints
  // Store the latest fused position in a ref
  const latestFusedPosition = useRef<any>(null);
  // Optionally, use local state for live display
  const [livePosition, setLivePosition] = useState<any>(null);

  // State for IMU data (only what we actually use)
  const [imuData, setIMUData] = useState<{
    heading: number;
    elevation: number;
    acceleration: { x: number; y: number; z: number };
    gyroscope: { x: number; y: number; z: number };
  } | null>(null);

  // Store individual GPS positions for fusion
  const primaryGPS = useRef<{ lat: number; lon: number } | null>(null);
  const secondaryGPS = useRef<{ lat: number; lon: number } | null>(null);

  // Use a ref to track the last update time for throttling
  const lastUpdateTimeRef = useRef<number>(0);

  // RTK GPS Correction Function
  // Uses primary GPS (rover) with secondary GPS (base) for RTK correction
  const getRTKCorrectedPosition = (): { lat: number; lon: number } | null => {
    const rover = primaryGPS.current; // Moving rover GPS
    const base = secondaryGPS.current; // Fixed base station GPS

    // If we have both base and rover, use RTK correction
    if (rover && base) {
      // RTK correction: Use rover position with base corrections
      // For now, we'll use the rover position directly (base provides corrections via NTRIP/RTCM)
      // In a real RTK system, the rover would already have base corrections applied

      return {
        lat: rover.lat,
        lon: rover.lon,
      };
    }

    // Fallback: Use rover if available
    if (rover) {
      return {
        lat: rover.lat,
        lon: rover.lon,
      };
    }

    // Fallback: Use base if available
    if (base) {
      return {
        lat: base.lat,
        lon: base.lon,
      };
    }

    return null;
  };

  // Vessel dimensions (would come from settings in a real app)
  const [vesselDimensions, setVesselDimensions] = useState({
    length: 40, // feet
    width: 16, // feet
    color: "#22c55e",
  });

  // ========================================================================
  // REACT HOOKS AND REFS
  // ========================================================================

  // create a single DataProcessor instance for this component
  const dataProcessorRef = useRef(new DataProcessor()).current;
  const latest = useRef<{ lat?: number; lon?: number; hdg?: number }>({});

  // ========================================================================
  // CONFIGURATION AND INITIALIZATION EFFECTS
  // ========================================================================

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
            "imu"
          );
        }
      } catch (error) {
        console.error("Auto-connection error:", error);
      }
    };

    // Add a small delay to ensure config is loaded
    setTimeout(autoConnectPorts, 500);
  }, [config.imu.port.enabled, config.imu.port.path, config.imu.port.baudRate]);

  // ========================================================================
  // SERIAL DATA COMMUNICATION EFFECTS
  // ========================================================================

  // IPC Communication - Handle serial data from main process
  useEffect(() => {
    const handleSerialData = (data: any) => {
      if (data.portType === "imu") {
        // Check if this is already processed WIT-Motion data or raw text data
        if (
          data.data &&
          typeof data.data === "object" &&
          typeof data.data.heading === "number"
        ) {
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
        if (
          gps &&
          Number.isFinite(gps.latitude) &&
          Number.isFinite(gps.longitude)
        ) {
          if (isPrimary) {
            // Store primary GPS position
            primaryGPS.current = { lat: gps.latitude, lon: gps.longitude };
          } else {
            // Store secondary GPS position
            secondaryGPS.current = { lat: gps.latitude, lon: gps.longitude };
          }

          // Get RTK corrected position
          const rtkPosition = getRTKCorrectedPosition();
          if (rtkPosition) {
            latest.current.lat = rtkPosition.lat;
            latest.current.lon = rtkPosition.lon;
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

  // ========================================================================
  // POSITION UPDATE AND TRACKING EFFECTS
  // ========================================================================

  // SINGLE HIGH-FREQUENCY POSITION UPDATE SYSTEM
  // This replaces all the chaotic overlapping effects with one clean, efficient system
  useEffect(() => {
    const updatePosition = () => {
      // Only update if we have valid sensor data
      if (latest.current.lat != null && latest.current.lon != null) {
        const currentTime = Date.now();

        // High-frequency updates (every 10ms = 100 FPS)
        if (currentTime - lastUpdateTimeRef.current < 10) {
          return;
        }
        lastUpdateTimeRef.current = currentTime;

        const newPosition = {
          latitude: latest.current.lat,
          longitude: latest.current.lon,
          heading: latest.current.hdg ?? 0,
          elevation: imuData?.elevation ?? 0,
          speed: 0,
          accuracy: 5,
        };

        // Only update if position actually changed
        if (
          !livePosition ||
          livePosition.latitude !== newPosition.latitude ||
          livePosition.longitude !== newPosition.longitude ||
          livePosition.heading !== newPosition.heading ||
          livePosition.elevation !== newPosition.elevation
        ) {
          setLivePosition(newPosition);
          latestFusedPosition.current = newPosition;
        }
      }
    };

    // Start high-frequency position updates
    const intervalId = setInterval(updatePosition, 10);

    return () => {
      clearInterval(intervalId);
    };
  }, [livePosition, imuData?.elevation]); // Include dependencies to prevent stale closures

  // NAVIGATION TRACKING - Save position to Redux store periodically
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isNavigating) {
      // Save position to Redux every 1 second while navigating
      intervalId = setInterval(() => {
        if (latestFusedPosition.current) {
          const positionData = {
            ...latestFusedPosition.current,
            timestamp: new Date().toISOString(),
          };
          
          // Update current position
          dispatch(updatePosition(positionData));
          
          // Add track point to current path
          dispatch(addTrackPoint(positionData));
          
          console.log(`[Navigation] Track point added: (${positionData.latitude.toFixed(6)}, ${positionData.longitude.toFixed(6)})`);
        }
      }, 1000);
    } else {
      // On navigation stop, save the final position
      if (latestFusedPosition.current) {
        const positionData = {
          ...latestFusedPosition.current,
          timestamp: new Date().toISOString(),
        };
        
        // Update current position
        dispatch(updatePosition(positionData));
        
        // Add final track point to current path
        dispatch(addTrackPoint(positionData));
        
        console.log(`[Navigation] Final track point added: (${positionData.latitude.toFixed(6)}, ${positionData.longitude.toFixed(6)})`);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isNavigating, dispatch]);

  // ========================================================================
  // MEMOIZED VALUES AND HANDLERS
  // ========================================================================

  // Prepare map props using useMemo to prevent unnecessary re-renders

  const mapWaypoints = React.useMemo(() => {
    return waypoints.map((wp) => ({
      id: wp.id,
      name: wp.name,
      latitude: wp.latitude,
      longitude: wp.longitude,
      heading: wp.heading || 0, // Default to 0 if heading not available
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
    if (livePosition && imuData) {
      // Auto-generate waypoint name with timestamp
      const timestamp = new Date().toLocaleTimeString();
      const waypointName = `WP_${timestamp}`;

      const newWaypoint = {
        id: `waypoint_${Date.now()}`,
        name: waypointName,
        latitude: livePosition.latitude,  // GPS position
        longitude: livePosition.longitude, // GPS position
        heading: imuData.heading,         // IMU heading for waypoint orientation
        timestamp: new Date().toISOString(),
      };

      dispatch(addWaypoint(newWaypoint));
      console.log(
        `[Waypoint] Added: ${waypointName} at (${livePosition.latitude.toFixed(
          6
        )}, ${livePosition.longitude.toFixed(6)}) with IMU heading: ${imuData.heading.toFixed(1)}°`
      );
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

    if (!routeToExport || routeToExport.trackPoints.length === 0) {
      alert(
        "No route to export. Please start and stop navigation to record a path."
      );
      return;
    }

    console.log("📤 Starting comprehensive export...");
    
    // Create timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `navigation-track-${timestamp}`;
    
    // Export JSON data
    exportTrackingData(routeToExport, filename);
  };

  const exportTrackingData = (routeToExport: any, filename: string) => {
    try {
      // Calculate comprehensive tracking statistics
      const trackingStats = calculateTrackingStatistics(routeToExport);
      
      // Prepare comprehensive tracking data
      const trackingData = {
        timestamp: new Date().toISOString(),
        filename: filename,
        vesselInfo: {
          dimensions: vesselDimensions,
          currentPosition: livePosition,
        },
        route: routeToExport,
        waypoints: waypoints.map(wp => ({
          id: wp.id,
          name: wp.name,
          latitude: wp.latitude,
          longitude: wp.longitude,
          heading: wp.heading,
          timestamp: wp.timestamp
        })),
        statistics: trackingStats,
        systemInfo: {
          gpsConfiguration: {
            primaryPort: config.ublox.primary.path || 'N/A',
            secondaryPort: config.ublox.secondary.path || 'N/A',
            baudRate: config.ublox.primary.baudRate || 'N/A',
          },
          imuData: imuData ? {
            heading: imuData.heading,
            acceleration: imuData.acceleration,
          } : null,
          connectionStatus: connectionStatus,
        }
      };
      
      // Save JSON data
      const jsonData = JSON.stringify(trackingData, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log("✅ JSON tracking data exported successfully!");
      
    } catch (error) {
      console.error("❌ JSON export failed:", error);
      alert("Failed to export tracking data: " + (error as Error).message);
    }
  };

  const calculateTrackingStatistics = (routeToExport: any) => {
    const stats = {
      startTime: null as string | null,
      endTime: null as string | null,
      duration: null as string | null,
      totalDistance: '0.00 mi',
      avgSpeed: '0.00 mph',
      startCoords: '--',
      endCoords: '--',
      totalTrackPoints: routeToExport.trackPoints.length,
      totalWaypoints: waypoints.length,
      maxSpeed: '0.00 mph',
      minSpeed: '0.00 mph'
    };
    
    if (routeToExport.trackPoints.length === 0) {
      return stats;
    }
    
    // Time information
    const firstPoint = routeToExport.trackPoints[0];
    const lastPoint = routeToExport.trackPoints[routeToExport.trackPoints.length - 1];
    
    if (firstPoint.timestamp && lastPoint.timestamp) {
      const startTime = new Date(firstPoint.timestamp);
      const endTime = new Date(lastPoint.timestamp);
      
      stats.startTime = startTime.toLocaleTimeString();
      stats.endTime = endTime.toLocaleTimeString();
      
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = Math.round(durationMs / 60000);
      stats.duration = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
    }
    
    // Distance and speed calculations
    let totalDistanceMeters = 0;
    const speeds: number[] = [];
    
    for (let i = 1; i < routeToExport.trackPoints.length; i++) {
      const dist = calculateDistance(
        routeToExport.trackPoints[i-1].latitude, routeToExport.trackPoints[i-1].longitude,
        routeToExport.trackPoints[i].latitude, routeToExport.trackPoints[i].longitude
      );
      totalDistanceMeters += dist;
      
      // Calculate speed if timestamps available
      if (routeToExport.trackPoints[i-1].timestamp && routeToExport.trackPoints[i].timestamp) {
        const timeDelta = new Date(routeToExport.trackPoints[i].timestamp).getTime() - 
                         new Date(routeToExport.trackPoints[i-1].timestamp).getTime();
        if (timeDelta > 0) {
          const speedMps = dist / (timeDelta / 1000);
          const speedMph = speedMps * 2.237;
          speeds.push(speedMph);
        }
      }
    }
    
    const totalDistanceMiles = totalDistanceMeters * 0.000621371;
    stats.totalDistance = totalDistanceMiles.toFixed(2) + ' mi';
    
    // Speed statistics
    if (speeds.length > 0) {
      const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
      stats.avgSpeed = avgSpeed.toFixed(2) + ' mph';
      stats.maxSpeed = Math.max(...speeds).toFixed(2) + ' mph';
      stats.minSpeed = Math.min(...speeds).toFixed(2) + ' mph';
    }
    
    // Coordinates
    stats.startCoords = `${firstPoint.latitude.toFixed(4)}, ${firstPoint.longitude.toFixed(4)}`;
    stats.endCoords = `${lastPoint.latitude.toFixed(4)}, ${lastPoint.longitude.toFixed(4)}`;
    
    return stats;
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Latitude:
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {livePosition.latitude.toFixed(6)}°
                  </span>
                  <span
                    className={`px-1 py-0.5 rounded text-xs ${
                      primaryGPS.current && secondaryGPS.current
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {primaryGPS.current && secondaryGPS.current
                      ? "RTK"
                      : "SINGLE"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Longitude:
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {livePosition.longitude.toFixed(6)}°
                  </span>
                  <span
                    className={`px-1 py-0.5 rounded text-xs ${
                      primaryGPS.current && secondaryGPS.current
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {primaryGPS.current && secondaryGPS.current
                      ? "RTK"
                      : "SINGLE"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Heading:
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
                    <div
                      className="w-1 h-3 bg-red-500 rounded-full"
                      style={{
                        transform: `rotate(${livePosition.heading}deg)`,
                      }}
                    ></div>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold text-lg">
                    {livePosition.heading.toFixed(1)}°
                  </span>
                  <span className="px-1 py-0.5 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    IMU
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Elevation:
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {imuData?.acceleration?.z?.toFixed(2) || "0.00"}m
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
            disabled={!((savedRoutes.length > 0 && savedRoutes[savedRoutes.length - 1]?.trackPoints.length > 0) || (currentPath && currentPath.trackPoints.length > 0))}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              (savedRoutes.length > 0 && savedRoutes[savedRoutes.length - 1]?.trackPoints.length > 0) || (currentPath && currentPath.trackPoints.length > 0)
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
            Add Current Position as Waypoint
          </h2>
          <button
            onClick={handleAddWaypoint}
            disabled={!livePosition}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {livePosition ? "Add Waypoint" : "No Position Available"}
          </button>
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
              <span className="font-semibold">Recording Path</span>
              <span className="text-sm opacity-90">
                ({currentPath?.trackPoints.length || 0} points)
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
