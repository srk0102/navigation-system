import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { importRoute, deleteRoute, NavigationPath} from "../store/slices/navigationSlice";
import { MapComponent } from "../components/Map";

export function MarineRoutes() {
  const dispatch = useDispatch();
  const { savedRoutes } = useSelector((state: RootState) => state.navigation);
  const [selectedRoute, setSelectedRoute] = useState<NavigationPath | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportRoute = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        console.log("📥 Importing navigation data:", importedData);

        // Check if this is our new comprehensive format or old format
        let routeData: NavigationPath;
        
        if (importedData.route) {
          // New comprehensive format with route object
          console.log("📋 Detected new comprehensive format");
          routeData = importedData.route;
          
          // Also import waypoints if they exist separately
          if (importedData.waypoints && Array.isArray(importedData.waypoints)) {
            console.log("📍 Found separate waypoints:", importedData.waypoints.length);
            // Add waypoints to the route if they're not already there
            if (!routeData.waypoints) {
              routeData.waypoints = [];
            }
            // Merge waypoints (avoid duplicates)
            importedData.waypoints.forEach((wp: any) => {
              if (!routeData.waypoints.find(existing => existing.id === wp.id)) {
                routeData.waypoints.push({
                  ...wp,
                  timestamp: typeof wp.timestamp === 'string' ? wp.timestamp : new Date(wp.timestamp).toISOString(),
                });
              }
            });
          }
        } else {
          // Old format - direct route object
          console.log("📋 Detected legacy format");
          routeData = importedData;
        }

        // Ensure proper data types and convert timestamps
        const processedRoute: NavigationPath = {
          id: routeData.id || `imported-${Date.now()}`,
          name: routeData.name || `Imported Route ${new Date().toLocaleDateString()}`,
          startTime: typeof routeData.startTime === 'string' ? routeData.startTime : new Date(routeData.startTime).toISOString(),
          endTime: routeData.endTime ? (typeof routeData.endTime === 'string' ? routeData.endTime : new Date(routeData.endTime).toISOString()) : null,
          waypoints: (routeData.waypoints || []).map((wp: any) => ({
            id: wp.id || `wp-${Date.now()}-${Math.random()}`,
            name: wp.name || `Waypoint ${Date.now()}`,
            latitude: typeof wp.latitude === 'number' ? wp.latitude : parseFloat(wp.latitude),
            longitude: typeof wp.longitude === 'number' ? wp.longitude : parseFloat(wp.longitude),
            heading: typeof wp.heading === 'number' ? wp.heading : 0,
            timestamp: typeof wp.timestamp === 'string' ? wp.timestamp : new Date(wp.timestamp).toISOString(),
          })),
          trackPoints: (routeData.trackPoints || []).map((tp: any) => ({
            latitude: typeof tp.latitude === 'number' ? tp.latitude : parseFloat(tp.latitude),
            longitude: typeof tp.longitude === 'number' ? tp.longitude : parseFloat(tp.longitude),
            heading: typeof tp.heading === 'number' ? tp.heading : 0,
            elevation: typeof tp.elevation === 'number' ? tp.elevation : 0,
            speed: typeof tp.speed === 'number' ? tp.speed : 0,
            accuracy: typeof tp.accuracy === 'number' ? tp.accuracy : 0,
            timestamp: typeof tp.timestamp === 'string' ? tp.timestamp : new Date(tp.timestamp).toISOString(),
          })),
          distance: typeof routeData.distance === 'number' ? routeData.distance : 0,
          duration: typeof routeData.duration === 'number' ? routeData.duration : 0,
        };

        console.log("✅ Processed route data:", {
          name: processedRoute.name,
          waypoints: processedRoute.waypoints.length,
          trackPoints: processedRoute.trackPoints.length,
          distance: processedRoute.distance,
          duration: processedRoute.duration
        });

        dispatch(importRoute(processedRoute));
        setSelectedRoute(processedRoute);
        
        // Show detailed success message
        const message = `Route imported successfully!\n\n` +
          `📊 Statistics:\n` +
          `• Track Points: ${processedRoute.trackPoints.length}\n` +
          `• Waypoints: ${processedRoute.waypoints.length}\n` +
          `• Distance: ${processedRoute.distance.toFixed(2)} km\n` +
          `• Duration: ${processedRoute.duration.toFixed(1)} minutes`;
        
        alert(message);
        
      } catch (error) {
        console.error("❌ Import failed:", error);
        alert(`Failed to import route: ${(error as Error).message}\n\nPlease check the file format.`);
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteRoute = (id: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      dispatch(deleteRoute(id));
      if (selectedRoute?.id === id) {
        setSelectedRoute(null);
      }
    }
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const calculateDistance = (points: { latitude: number; longitude: number }[]): number => {
    if (points.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const lat1 = points[i - 1].latitude * Math.PI / 180;
      const lat2 = points[i].latitude * Math.PI / 180;
      const deltaLat = (points[i].latitude - points[i - 1].latitude) * Math.PI / 180;
      const deltaLon = (points[i].longitude - points[i - 1].longitude) * Math.PI / 180;

      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371000 * c; // Earth radius in meters

      totalDistance += distance;
    }

    return totalDistance;
  };

  // Prepare map props from selected route
  const mapCenter = selectedRoute && selectedRoute.trackPoints.length > 0
    ? {
        latitude: selectedRoute.trackPoints[0].latitude,
        longitude: selectedRoute.trackPoints[0].longitude,
      }
    : undefined;

  const mapTracks = selectedRoute
    ? [
        {
          points: selectedRoute.trackPoints.map(p => ({
            latitude: p.latitude,
            longitude: p.longitude,
          })),
          color: '#3b82f6',
          width: 3,
        },
      ]
    : [];

  const mapWaypoints = selectedRoute
    ? selectedRoute.waypoints.map(wp => ({
        id: wp.id,
        name: wp.name,
        latitude: wp.latitude,
        longitude: wp.longitude,
        heading: wp.heading, // Pass the heading for proper orientation
      }))
    : [];

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar - Routes List */}
      <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Saved Routes
            </h1>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportRoute}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
            >
              Import
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {savedRoutes.length} route{savedRoutes.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Routes List */}
        <div className="flex-1 overflow-y-auto">
          {savedRoutes.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No routes saved yet
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {savedRoutes.map((route) => {
                const distance = calculateDistance(route.trackPoints);
                const avgSpeed = route.trackPoints.length > 0
                  ? route.trackPoints.reduce((sum, p) => sum + p.speed, 0) / route.trackPoints.length
                  : 0;

                return (
                  <div
                    key={route.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedRoute?.id === route.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {route.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoute(route.id);
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-700"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Distance:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {(distance / 1000).toFixed(2)} km
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Points:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {route.trackPoints.length}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Avg Speed:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {avgSpeed.toFixed(1)} kn
                        </span>
                      </div>
                      {route.endTime && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Duration:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatDuration(route.duration)}
                          </span>
                        </div>
                      )}
                      <div className="text-gray-500 dark:text-gray-500 pt-1 border-t border-gray-200 dark:border-gray-700">
                        {new Date(route.startTime).toLocaleDateString()} {new Date(route.startTime).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Map and Details */}
      <div className="flex-1 flex flex-col">
        {/* Map - Always visible */}
        <div className="flex-1 relative">
          <MapComponent
            center={mapCenter}
            zoom={mapCenter ? 15 : 2}
            waypoints={mapWaypoints}
            tracks={mapTracks}
          />

          {/* Overlay message when no route selected */}
          {!selectedRoute && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center bg-white/90 dark:bg-gray-800/90 p-6 rounded-lg shadow-lg max-w-sm">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <h3 className="mt-3 text-base font-medium text-gray-900 dark:text-white">
                  {savedRoutes.length === 0 ? 'No Routes Yet' : 'Select a Route'}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {savedRoutes.length === 0 
                    ? 'Start navigating to record routes, or import an existing route file.'
                    : 'Choose a route from the sidebar to view it on the map'}
                </p>
              </div>
            </div>
          )}

          {/* Map Legend */}
          {selectedRoute && (
            <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Legend
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                  <span className="text-gray-600 dark:text-gray-400">Start Point</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
                  <span className="text-gray-600 dark:text-gray-400">End Point / Waypoint</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-0.5 bg-blue-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Track Path</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Route Statistics */}
        {selectedRoute && (
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 overflow-y-auto">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Route Statistics - {selectedRoute.name}
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {/* Distance */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Distance</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {(calculateDistance(selectedRoute.trackPoints) / 1000).toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">kilometers</div>
              </div>

              {/* Points */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Track Points</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {selectedRoute.trackPoints.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">positions recorded</div>
              </div>

              {/* Waypoints */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Waypoints</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {selectedRoute.waypoints.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">planned points</div>
              </div>

              {/* Average Speed */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Speed</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {selectedRoute.trackPoints.length > 0
                    ? (selectedRoute.trackPoints.reduce((sum, p) => sum + p.speed, 0) / selectedRoute.trackPoints.length).toFixed(1)
                    : '0.0'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">knots</div>
              </div>

              {/* Max Speed */}
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max Speed</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {selectedRoute.trackPoints.length > 0
                    ? Math.max(...selectedRoute.trackPoints.map(p => p.speed)).toFixed(1)
                    : '0.0'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">knots</div>
              </div>

              {/* Duration */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedRoute.endTime ? formatDuration(selectedRoute.duration) : 'Active'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">time elapsed</div>
              </div>

              {/* Start Time */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Start Time</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(selectedRoute.startTime).toLocaleTimeString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(selectedRoute.startTime).toLocaleDateString()}
                </div>
              </div>

              {/* End Time */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">End Time</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedRoute.endTime 
                    ? new Date(selectedRoute.endTime).toLocaleTimeString()
                    : 'In Progress'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedRoute.endTime 
                    ? new Date(selectedRoute.endTime).toLocaleDateString()
                    : '-'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

