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
  addReferenceRoute,
  removeReferenceRoute,
  clearReferenceRoutes,
  addImportedRegion,
  removeImportedRegion,
  clearImportedRegions,
  setContinuedSession,
  clearContinuedSession,
} from "../store/slices/navigationSlice";
import { MapComponent } from "../components/Map";
import { DataProcessor } from "../services/DataProcessor";
import { Fusion } from "../services/Fusion";
import type { GPSData, IMUData } from "../services/Fusion";

export function Navigation() {
  const dispatch = useDispatch();
  const {
    waypoints,
    isNavigating,
    connectionStatus,
    currentPath,
    savedRoutes,
    referenceRoutes,
    importedRegions,
    continuedSession,
  } = useSelector((state: RootState) => state.navigation);
  const config = useSelector((state: RootState) => state.config);

  const latestFusedPosition = useRef<any>(null);
  const [livePosition, setLivePosition] = useState<any>(null);

  const [imuData, setIMUData] = useState<{
    heading: number;
    elevation: number;
    acceleration: { x: number; y: number; z: number };
    gyroscope: { x: number; y: number; z: number };
  } | null>(null);

  const primaryGPS = useRef<{ lat: number; lon: number } | null>(null);
  const secondaryGPS = useRef<{ lat: number; lon: number } | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  // Distance-based track saving: only save when moved >= 3 meters
  const MIN_TRACK_DISTANCE = 3; // meters
  const lastSavedPosition = useRef<{ lat: number; lon: number } | null>(null);
  const trackPointsRef = useRef<any[]>([]); // in-memory track points for current session
  const [trackPointCount, setTrackPointCount] = useState(0);

  // File input refs
  const refFileInputRef = useRef<HTMLInputElement>(null);
  const kmlFileInputRef = useRef<HTMLInputElement>(null);

  // Map zoom-to-fit callback
  const mapZoomToFitRef = useRef<(() => void) | null>(null);

  const [vesselDimensions, setVesselDimensions] = useState({
    length: 40,
    width: 16,
    color: "#22c55e",
  });

  // ========================================================================
  // FUSION ENGINE + EMA HEADING SMOOTHING
  // ========================================================================
  const fusionRef = useRef(new Fusion());
  const dataProcessorRef = useRef(new DataProcessor()).current;

  // EMA heading smoothing (like 1.6.0)
  const smoothedHeading = useRef<number | null>(null);
  const EMA_ALPHA = 0.3;

  // ========================================================================
  // CONFIGURATION AND INITIALIZATION
  // ========================================================================

  useEffect(() => {
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

  // Auto-zoom to fit when continued session is loaded
  useEffect(() => {
    if (continuedSession && mapZoomToFitRef.current) {
      setTimeout(() => mapZoomToFitRef.current?.(), 500);
    }
  }, [continuedSession]);

  // Auto-connect to configured ports
  useEffect(() => {
    const autoConnectPorts = async () => {
      try {
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
    setTimeout(autoConnectPorts, 500);
  }, [config.imu.port.enabled, config.imu.port.path, config.imu.port.baudRate]);

  // ========================================================================
  // SERIAL DATA -> FUSION ENGINE (with heading offset + EMA smoothing)
  // ========================================================================

  useEffect(() => {
    const fusion = fusionRef.current;
    const headingOffset = (config.imu as any).headingOffset ?? 0;

    const handleSerialData = (data: any) => {
      const now = Date.now();

      if (data.portType === "imu") {
        let rawHeading: number | undefined;
        let imuPitch = 0;
        let imuAccel = { x: 0, y: 0, z: 0 };
        let imuGyro = { x: 0, y: 0, z: 0 };

        if (data.data && typeof data.data === "object" && typeof data.data.heading === "number") {
          const imu = data.data;
          if (Number.isFinite(imu.heading)) {
            rawHeading = imu.heading;
            imuPitch = imu.pitch ?? 0;
            imuAccel = imu.acceleration ?? { x: 0, y: 0, z: 0 };
            imuGyro = imu.gyroscope ?? { x: 0, y: 0, z: 0 };
          }
        } else {
          try {
            const imu = dataProcessorRef.processIMUData(data.data);
            if (imu && Number.isFinite(imu.heading)) {
              rawHeading = imu.heading;
              imuPitch = imu.pitch ?? 0;
              imuAccel = imu.acceleration ?? { x: 0, y: 0, z: 0 };
              imuGyro = imu.gyroscope ?? { x: 0, y: 0, z: 0 };
            }
          } catch (err) {
            console.error("IMU Processing Error:", err);
          }
        }

        if (rawHeading !== undefined) {
          // Apply heading offset from config
          const offsetHeading = ((rawHeading + headingOffset) % 360 + 360) % 360;

          // EMA smoothing (like 1.6.0)
          if (smoothedHeading.current === null) {
            smoothedHeading.current = offsetHeading;
          } else {
            let diff = offsetHeading - smoothedHeading.current;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            smoothedHeading.current = ((smoothedHeading.current + EMA_ALPHA * diff) % 360 + 360) % 360;
          }

          // Feed into fusion engine
          const imuDataForFusion: IMUData = {
            heading: smoothedHeading.current,
            pitch: imuPitch,
            acceleration: imuAccel,
            gyroscope: imuGyro,
            timestamp: now,
          };
          fusion.processIMU(imuDataForFusion);

          setIMUData({
            heading: smoothedHeading.current,
            elevation: imuPitch,
            acceleration: imuAccel,
            gyroscope: imuGyro,
          });
        }
      }

      if (data.portType === "primaryGNSS" || data.portType === "secondaryGNSS") {
        const isPrimary = data.portType === "primaryGNSS";
        const gps = dataProcessorRef.processGPSData(data.data, isPrimary);

        if (gps && Number.isFinite(gps.latitude) && Number.isFinite(gps.longitude)) {
          if (isPrimary) {
            primaryGPS.current = { lat: gps.latitude, lon: gps.longitude };
          } else {
            secondaryGPS.current = { lat: gps.latitude, lon: gps.longitude };
          }

          if (isPrimary) {
            const gpsData: GPSData = {
              latitude: gps.latitude,
              longitude: gps.longitude,
              altitude: data.data.altitude,
              speed: data.data.speed,
              heading: data.data.heading,
              accuracy: data.data.hdop ? data.data.hdop * 2.5 : undefined,
              quality: data.data.quality,
              satellites: data.data.satellites,
              hdop: data.data.hdop,
              timestamp: now,
            };
            fusion.processGNSS(gpsData);
          }
        }
      }
    };

    const handleConnectionUpdate = (status: any) => {
      dispatch(updateConnectionStatus(status));
    };

    window.ipcRenderer.navigation.onSerialData(handleSerialData);
    window.ipcRenderer.navigation.onConnectionStatusUpdate(handleConnectionUpdate);

    return () => {
      window.ipcRenderer.off("serial-data", handleSerialData);
      window.ipcRenderer.off("connection-status-update", handleConnectionUpdate);
    };
  }, [dispatch, dataProcessorRef, config.imu]);

  // ========================================================================
  // POSITION UPDATE FROM FUSION ENGINE
  // ========================================================================

  useEffect(() => {
    const fusion = fusionRef.current;

    const updatePositionFromFusion = () => {
      const fused = fusion.getFused();
      if (!fused) return;

      const currentTime = Date.now();
      if (currentTime - lastUpdateTimeRef.current < 50) return;
      lastUpdateTimeRef.current = currentTime;

      const newPosition = {
        latitude: fused.latitude,
        longitude: fused.longitude,
        heading: fused.heading,
        elevation: imuData?.elevation ?? 0,
        speed: fused.speed,
        accuracy: fused.accuracy,
      };

      if (
        !livePosition ||
        livePosition.latitude !== newPosition.latitude ||
        livePosition.longitude !== newPosition.longitude ||
        livePosition.heading !== newPosition.heading
      ) {
        setLivePosition(newPosition);
        latestFusedPosition.current = newPosition;
      }
    };

    const intervalId = setInterval(updatePositionFromFusion, 50);
    return () => clearInterval(intervalId);
  }, [livePosition, imuData?.elevation]);

  // ========================================================================
  // NAVIGATION TRACKING - Distance-based saving (3m minimum)
  // ========================================================================

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isNavigating) {
      intervalId = setInterval(() => {
        if (!latestFusedPosition.current) return;

        const pos = latestFusedPosition.current;
        let shouldSave = false;

        if (lastSavedPosition.current === null) {
          shouldSave = true;
        } else {
          const dist = haversineDistance(
            lastSavedPosition.current.lat, lastSavedPosition.current.lon,
            pos.latitude, pos.longitude
          );
          if (dist >= MIN_TRACK_DISTANCE) {
            shouldSave = true;
          }
        }

        if (shouldSave) {
          const positionData = {
            ...pos,
            timestamp: new Date().toISOString(),
          };
          dispatch(updatePosition(positionData));
          dispatch(addTrackPoint(positionData));
          trackPointsRef.current.push(positionData);
          setTrackPointCount(trackPointsRef.current.length);
          lastSavedPosition.current = { lat: pos.latitude, lon: pos.longitude };
        }
      }, 500); // Check every 500ms (like 1.6.0)
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isNavigating, dispatch]);

  // ========================================================================
  // MEMOIZED MAP DATA
  // ========================================================================

  // Combine current waypoints + continued session waypoints for map
  const mapWaypoints = React.useMemo(() => {
    const wps: Array<{ id: string; name: string; latitude: number; longitude: number; heading: number }> = [];

    // Continued session waypoints
    if (continuedSession?.waypoints) {
      continuedSession.waypoints.forEach((wp) => {
        if (wp && Number.isFinite(wp.latitude) && Number.isFinite(wp.longitude)) {
          wps.push({
            id: wp.id,
            name: wp.name,
            latitude: wp.latitude,
            longitude: wp.longitude,
            heading: wp.heading || 0,
          });
        }
      });
    }

    // Current session waypoints
    waypoints.forEach((wp) => {
      wps.push({
        id: wp.id,
        name: wp.name,
        latitude: wp.latitude,
        longitude: wp.longitude,
        heading: wp.heading || 0,
      });
    });

    return wps;
  }, [waypoints, continuedSession]);

  // Combine: continued session track (gray) + current track (green) + reference routes
  const mapTracks = React.useMemo(() => {
    const tracks: Array<{ points: Array<{ latitude: number; longitude: number }>; color: string; width: number }> = [];

    // Continued session track (gray, behind current)
    if (continuedSession && continuedSession.trackPoints.length > 0) {
      tracks.push({
        points: continuedSession.trackPoints.map((p) => ({
          latitude: p.latitude,
          longitude: p.longitude,
        })),
        color: "#9ca3af",
        width: 2,
      });
    }

    // Current navigation track (green)
    if (trackPointCount > 1) {
      tracks.push({
        points: trackPointsRef.current.map((p) => ({
          latitude: p.latitude,
          longitude: p.longitude,
        })),
        color: "#22c55e",
        width: 3,
      });
    }

    // Reference routes (each with distinct color)
    referenceRoutes.forEach((ref) => {
      if (ref.trackPoints.length > 1) {
        tracks.push({
          points: ref.trackPoints,
          color: ref.color,
          width: 2,
        });
      }
    });

    return tracks;
  }, [trackPointCount, referenceRoutes, continuedSession]);

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

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleAddWaypoint = () => {
    if (livePosition && imuData) {
      const timestamp = new Date().toLocaleTimeString();
      const waypointName = `WP_${timestamp}`;
      dispatch(addWaypoint({
        name: waypointName,
        latitude: livePosition.latitude,
        longitude: livePosition.longitude,
        heading: imuData.heading,
      }));
    }
  };

  const handleRemoveWaypoint = (id: string) => {
    dispatch(removeWaypoint(id));
  };

  const handleToggleNavigation = () => {
    if (isNavigating) {
      dispatch(stopNavigation());
    } else {
      fusionRef.current = new Fusion();
      smoothedHeading.current = null;
      trackPointsRef.current = [];
      lastSavedPosition.current = null;
      setTrackPointCount(0);
      dispatch(startNavigation());
    }
  };

  const handleExportRoute = () => {
    const routeToExport = savedRoutes.length > 0
      ? savedRoutes[savedRoutes.length - 1]
      : currentPath;

    if (!routeToExport || routeToExport.trackPoints.length === 0) {
      alert("No route to export. Please start and stop navigation to record a path.");
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `navigation-track-${timestamp}`;
    exportTrackingData(routeToExport, filename);
  };

  const exportTrackingData = (routeToExport: any, filename: string) => {
    try {
      const trackingStats = calculateTrackingStatistics(routeToExport);
      const trackingData = {
        timestamp: new Date().toISOString(),
        filename,
        vesselInfo: { dimensions: vesselDimensions, currentPosition: livePosition },
        route: routeToExport,
        waypoints: waypoints.map(wp => ({
          id: wp.id, name: wp.name, latitude: wp.latitude,
          longitude: wp.longitude, heading: wp.heading, timestamp: wp.timestamp,
        })),
        statistics: trackingStats,
        systemInfo: {
          gpsConfiguration: {
            primaryPort: config.ublox.primary.path || 'N/A',
            secondaryPort: config.ublox.secondary.path || 'N/A',
            baudRate: config.ublox.primary.baudRate || 'N/A',
          },
          imuData: imuData ? { heading: imuData.heading, acceleration: imuData.acceleration } : null,
          connectionStatus,
        },
      };

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
    } catch (error) {
      console.error("JSON export failed:", error);
      alert("Failed to export tracking data: " + (error as Error).message);
    }
  };

  // ========================================================================
  // REFERENCE ROUTE IMPORT (JSON navigation files as track overlays)
  // ========================================================================

  const handleLoadReferenceFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          const routeData = imported.route || imported;
          const trackPoints = routeData.trackPoints || [];
          if (trackPoints.length === 0) return;

          const points = trackPoints
            .filter((tp: any) => Number.isFinite(tp.latitude) && Number.isFinite(tp.longitude))
            .map((tp: any) => ({
              latitude: typeof tp.latitude === 'number' ? tp.latitude : parseFloat(tp.latitude),
              longitude: typeof tp.longitude === 'number' ? tp.longitude : parseFloat(tp.longitude),
            }));

          if (points.length > 0) {
            dispatch(addReferenceRoute({
              name: routeData.name || file.name.replace('.json', ''),
              trackPoints: points,
            }));
          }
        } catch (error) {
          console.error(`Failed to load reference route from ${file.name}:`, error);
        }
      };
      reader.readAsText(file);
    });

    if (refFileInputRef.current) refFileInputRef.current.value = '';
  };

  // ========================================================================
  // KMZ/KML IMPORT (imported regions rendered as polygons on map)
  // ========================================================================

  const handleImportKMLFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let kmlText = '';

      if (file.name.toLowerCase().endsWith('.kmz')) {
        // KMZ = zipped KML - need JSZip
        const { default: JSZip } = await import('jszip');
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        const kmlFile = zip.file(/\.kml$/i)[0];
        if (!kmlFile) throw new Error('No KML file found inside KMZ');
        kmlText = await kmlFile.async('text');
      } else {
        kmlText = await file.text();
      }

      // Parse KML to extract GPS points
      const parser = new DOMParser();
      const doc = parser.parseFromString(kmlText, 'text/xml');
      const points: Array<{ latitude: number; longitude: number }> = [];

      // Extract coordinates from all KML coordinate elements
      const coordElements = doc.getElementsByTagName('coordinates');
      for (let i = 0; i < coordElements.length; i++) {
        const coordText = coordElements[i].textContent?.trim() || '';
        coordText.split(/\s+/).forEach((coordStr) => {
          const parts = coordStr.split(',').map(Number);
          if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            const lon = parts[0];
            const lat = parts[1];
            if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
              points.push({ latitude: lat, longitude: lon });
            }
          }
        });
      }

      if (points.length === 0) {
        alert('No valid GPS coordinates found in the KMZ/KML file.');
        return;
      }

      dispatch(addImportedRegion({
        id: `region-${Date.now()}`,
        name: file.name.replace(/\.(kmz|kml)$/i, ''),
        points,
        color: '#fbbf24',
        timestamp: new Date().toISOString(),
      }));

      alert(`Successfully imported ${points.length} GPS points from ${file.name}`);
    } catch (error) {
      console.error('KMZ/KML import failed:', error);
      alert(`Failed to import KMZ/KML file: ${(error as Error).message}`);
    }

    if (kmlFileInputRef.current) kmlFileInputRef.current.value = '';
  };

  // ========================================================================
  // CONTINUE FROM SAVED ROUTE (load previous session as overlay)
  // ========================================================================

  const handleContinueFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        const routeData = imported.route || imported;
        const trackPoints = (routeData.trackPoints || []).filter(
          (tp: any) => Number.isFinite(tp.latitude) && Number.isFinite(tp.longitude)
        );
        const wps = (routeData.waypoints || imported.waypoints || []).filter(
          (wp: any) => Number.isFinite(wp.latitude) && Number.isFinite(wp.longitude)
        );

        const name = file.name.replace('.json', '');
        dispatch(setContinuedSession({
          trackPoints,
          waypoints: wps,
          sessionName: name,
          sessionDate: routeData.startTime || new Date().toISOString(),
        }));
      } catch (error) {
        console.error('Failed to load continued session:', error);
        alert(`Failed to load session: ${(error as Error).message}`);
      }
    };
    reader.readAsText(file);
  };

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const calculateTrackingStatistics = (routeToExport: any) => {
    const stats: any = {
      startTime: null, endTime: null, duration: null,
      totalDistance: '0.00 mi', avgSpeed: '0.00 mph',
      startCoords: '--', endCoords: '--',
      totalTrackPoints: routeToExport.trackPoints.length,
      totalWaypoints: waypoints.length,
      maxSpeed: '0.00 mph', minSpeed: '0.00 mph',
    };
    if (routeToExport.trackPoints.length === 0) return stats;

    const firstPoint = routeToExport.trackPoints[0];
    const lastPoint = routeToExport.trackPoints[routeToExport.trackPoints.length - 1];

    if (firstPoint.timestamp && lastPoint.timestamp) {
      const startTime = new Date(firstPoint.timestamp);
      const endTime = new Date(lastPoint.timestamp);
      stats.startTime = startTime.toLocaleTimeString();
      stats.endTime = endTime.toLocaleTimeString();
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
      stats.duration = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
    }

    let totalDistanceMeters = 0;
    const speeds: number[] = [];
    for (let i = 1; i < routeToExport.trackPoints.length; i++) {
      const dist = haversineDistance(
        routeToExport.trackPoints[i - 1].latitude, routeToExport.trackPoints[i - 1].longitude,
        routeToExport.trackPoints[i].latitude, routeToExport.trackPoints[i].longitude
      );
      totalDistanceMeters += dist;
      if (routeToExport.trackPoints[i - 1].timestamp && routeToExport.trackPoints[i].timestamp) {
        const timeDelta = new Date(routeToExport.trackPoints[i].timestamp).getTime() -
          new Date(routeToExport.trackPoints[i - 1].timestamp).getTime();
        if (timeDelta > 0) speeds.push((dist / (timeDelta / 1000)) * 2.237);
      }
    }
    stats.totalDistance = (totalDistanceMeters * 0.000621371).toFixed(2) + ' mi';
    if (speeds.length > 0) {
      stats.avgSpeed = (speeds.reduce((s, v) => s + v, 0) / speeds.length).toFixed(2) + ' mph';
      stats.maxSpeed = Math.max(...speeds).toFixed(2) + ' mph';
      stats.minSpeed = Math.min(...speeds).toFixed(2) + ' mph';
    }
    stats.startCoords = `${firstPoint.latitude.toFixed(4)}, ${firstPoint.longitude.toFixed(4)}`;
    stats.endCoords = `${lastPoint.latitude.toFixed(4)}, ${lastPoint.longitude.toFixed(4)}`;
    return stats;
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        {/* Current Position */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Current Position</h2>
          {livePosition ? (
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Latitude:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 dark:text-white font-semibold">{livePosition.latitude.toFixed(6)}°</span>
                  <span className={`px-1 py-0.5 rounded text-xs ${primaryGPS.current && secondaryGPS.current ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`}>
                    {primaryGPS.current && secondaryGPS.current ? "RTK" : "SINGLE"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Longitude:</span>
                <span className="text-gray-900 dark:text-white font-semibold">{livePosition.longitude.toFixed(6)}°</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Heading:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
                    <div className="w-1 h-3 bg-red-500 rounded-full" style={{ transform: `rotate(${livePosition.heading}deg)` }}></div>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold text-lg">{livePosition.heading.toFixed(1)}°</span>
                  <span className="px-1 py-0.5 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">FUSED</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Speed:</span>
                <span className="text-gray-900 dark:text-white font-semibold">{(livePosition.speed * 1.94384).toFixed(1)} kn</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
                <span className="text-gray-900 dark:text-white font-semibold">±{livePosition.accuracy.toFixed(1)}m</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No position data</p>
          )}
        </div>

        {/* Connection Status */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Connection Status</h2>
          <div className="space-y-1 text-xs">
            {(["primaryGNSS", "secondaryGNSS", "imu"] as const).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{key === "primaryGNSS" ? "Primary GNSS" : key === "secondaryGNSS" ? "Secondary GNSS" : "IMU Sensor"}:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${connectionStatus[key] ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {connectionStatus[key] ? "Connected" : "Disconnected"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Control */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-2">
          <button onClick={handleToggleNavigation}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${isNavigating ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}>
            {isNavigating ? "Stop Navigation" : "Start Navigation"}
          </button>
          <button onClick={handleExportRoute}
            disabled={!((savedRoutes.length > 0 && savedRoutes[savedRoutes.length - 1]?.trackPoints.length > 0) || (currentPath && currentPath.trackPoints.length > 0))}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${(savedRoutes.length > 0 && savedRoutes[savedRoutes.length - 1]?.trackPoints.length > 0) || (currentPath && currentPath.trackPoints.length > 0) ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"}`}>
            Export Route
          </button>
        </div>

        {/* Load Past Routes (JSON track overlays) */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Reference Routes</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Load past navigation files to see them on the map.</p>
          <input ref={refFileInputRef} type="file" accept=".json" multiple onChange={handleLoadReferenceFiles} className="hidden" />
          <button onClick={() => refFileInputRef.current?.click()}
            className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-colors">
            Load Past Routes
          </button>

          {referenceRoutes.length > 0 && (
            <div className="mt-3 space-y-1">
              {referenceRoutes.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-gray-900/50 rounded text-xs">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ref.color }} />
                    <span className="text-gray-900 dark:text-white truncate">{ref.name}</span>
                    <span className="text-gray-500 flex-shrink-0">({ref.trackPoints.length} pts)</span>
                  </div>
                  <button onClick={() => dispatch(removeReferenceRoute(ref.id))} className="text-red-500 hover:text-red-700 ml-2">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))}
              <button onClick={() => dispatch(clearReferenceRoutes())} className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 mt-1">Clear All References</button>
            </div>
          )}
        </div>

        {/* Import KMZ/KML Regions */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Import Regions</h2>
          <input ref={kmlFileInputRef} type="file" accept=".kmz,.kml" onChange={handleImportKMLFile} className="hidden" />
          <div className="flex space-x-2">
            <button onClick={() => kmlFileInputRef.current?.click()}
              className="flex-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md transition-colors text-center">
              Import KMZ/KML
            </button>
            <input type="file" accept=".json" onChange={handleContinueFromFile} className="hidden" id="continue-file-input" />
            <button onClick={() => document.getElementById('continue-file-input')?.click()}
              className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors text-center">
              Continue Session
            </button>
          </div>

          {/* Imported Regions list */}
          {importedRegions.length > 0 && (
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Imported Regions ({importedRegions.length})</span>
                <button onClick={() => dispatch(clearImportedRegions())} className="text-xs text-red-600 dark:text-red-400 hover:text-red-700">Clear All</button>
              </div>
              {importedRegions.map((region) => (
                <div key={region.id} className="flex items-center justify-between px-2 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{region.name}</div>
                    <div className="text-gray-500">{region.points.length} GPS points</div>
                  </div>
                  <button onClick={() => dispatch(removeImportedRegion(region.id))} className="text-red-500 hover:text-red-700">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Waypoint */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Add Current Position as Waypoint</h2>
          <button onClick={handleAddWaypoint} disabled={!livePosition}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            {livePosition ? "Add Waypoint" : "No Position Available"}
          </button>
        </div>

        {/* Waypoints List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Waypoints ({waypoints.length})</h2>
              {waypoints.length > 0 && (
                <button onClick={() => dispatch(clearWaypoints())} className="text-xs text-red-600 dark:text-red-400 hover:text-red-700">Clear All</button>
              )}
            </div>
            {waypoints.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No waypoints added</p>
            ) : (
              <div className="space-y-2">
                {waypoints.map((waypoint, index) => (
                  <div key={waypoint.id} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold">{index + 1}</span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{waypoint.name}</span>
                      </div>
                      <button onClick={() => handleRemoveWaypoint(waypoint.id)} className="text-red-600 dark:text-red-400 hover:text-red-700">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
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
      <div id="map-export-container" className="flex-1 relative">
        <MapComponent
          center={livePosition ? { latitude: livePosition.latitude, longitude: livePosition.longitude } : undefined}
          zoom={livePosition ? 15 : 2}
          waypoints={mapWaypoints}
          tracks={mapTracks}
          showCurrentPosition={!!livePosition}
          currentPosition={currentPositionForMap}
          vesselDimensions={vesselDimensions}
          importedRegions={importedRegions}
          onMapReady={(fn) => { mapZoomToFitRef.current = fn; }}
        />

        {/* Continued session banner */}
        {continuedSession && (
          <div className="absolute top-4 left-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-semibold">Continued: {continuedSession.sessionName}</span>
                <span className="opacity-75">({continuedSession.trackPoints.length} pts)</span>
              </div>
              <button onClick={() => dispatch(clearContinuedSession())} className="text-white/80 hover:text-white text-xs">Dismiss</button>
            </div>
          </div>
        )}

        {/* Navigation recording status */}
        {isNavigating && (
          <div className={`absolute ${continuedSession ? 'top-14' : 'top-4'} left-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg`}>
            <span className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="font-semibold">Recording Path</span>
              <span className="text-sm opacity-90">({trackPointCount} points)</span>
            </span>
          </div>
        )}

        {/* Reference routes legend */}
        {referenceRoutes.length > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Past Routes</div>
            {referenceRoutes.map((ref) => (
              <div key={ref.id} className="flex items-center space-x-2 text-xs py-0.5">
                <div className="w-4 h-0.5 rounded" style={{ backgroundColor: ref.color }} />
                <span className="text-gray-600 dark:text-gray-400">{ref.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
