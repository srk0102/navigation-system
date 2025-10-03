import React, { useRef, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { PinchZoom, DoubleClickZoom } from "ol/interaction";
import {
  defaults as defaultControls,
  ZoomSlider,
  FullScreen,
  ScaleLine,
  MousePosition,
} from "ol/control";
import { createStringXY } from "ol/coordinate";
import { Feature } from "ol";
import { LineString, Polygon } from "ol/geom";
import { Style, Fill, Stroke } from "ol/style";
import "ol/ol.css";
import "./Map.css"; // Custom map styles

export interface MapPosition {
  latitude: number;
  longitude: number;
}
export interface MapWaypoint extends MapPosition {
  id: string;
  name: string;
  heading?: number;
}
export interface MapTrack {
  points: MapPosition[];
  color?: string;
  width?: number;
}
export interface VesselDimensions {
  length: number; // in meters
  width: number; // in meters
  color?: string;
}

interface MapComponentProps {
  center?: MapPosition;
  zoom?: number;
  waypoints?: MapWaypoint[];
  tracks?: MapTrack[];
  showCurrentPosition?: boolean;
  currentPosition?: MapPosition & { heading?: number };
  vesselDimensions?: VesselDimensions;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}

// Modify vessel rendering and zooming logic
export function MapComponent({
  center,
  zoom = 2,
  waypoints = [],
  tracks = [],
  showCurrentPosition = false,
  currentPosition,
  vesselDimensions = { length: 40, width: 16, color: "#22c55e" },
  onMapClick,
  className = "w-full h-full",
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorLayerRef = useRef<any>(null);
  const hasInitializedCenter = useRef<boolean>(false); // Track if map has been centered initially
  const userInteractedRef = useRef<boolean>(false); // Track if user has interacted with map

  // Memoize vessel dimensions conversion
  const vesselDimensionsMeters = React.useMemo(
    () => ({
      length: vesselDimensions.length * 0.3048, // Convert feet to meters
      width: vesselDimensions.width * 0.3048, // Convert feet to meters
      color: vesselDimensions.color,
    }),
    [vesselDimensions]
  );

  // 1. Only create the map ONCE
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return;

    try {
      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        zIndex: 10, // Ensure vector layer is on top
      });

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
              maxZoom: 22,
              tileSize: 256,
              attributions: "© Google",
            }),
          }),
          new TileLayer({
            source: new XYZ({
              url: "https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}",
              maxZoom: 22,
              tileSize: 256,
            }),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([center?.longitude || 0, center?.latitude || 0]),
          zoom,
          maxZoom: 22,
          minZoom: 2,
        }),
        controls: defaultControls({
          zoom: true,
          rotate: false,
          attribution: true,
        }).extend([
          new ZoomSlider(),
          new ScaleLine({ units: "metric" }),
          new FullScreen(),
          new MousePosition({
            coordinateFormat: createStringXY(6),
            projection: "EPSG:4326",
            className: "ol-mouse-position",
          }),
        ]),
      });

      // Add enhanced interactions for better zoom/pan
      map.addInteraction(new DoubleClickZoom());
      map.addInteraction(new PinchZoom());

      // Ensure mouse wheel zoom is active
      map.getInteractions().forEach((interaction) => {
        if (interaction.get("type") === "wheel") {
          interaction.setActive(true);
        }
      });

      // Track user interactions (pan, zoom, etc.)
      map.getView().on("change:center", () => {
        if (hasInitializedCenter.current) {
          userInteractedRef.current = true;
        }
      });

      map.getView().on("change:resolution", () => {
        if (hasInitializedCenter.current) {
          userInteractedRef.current = true;
        }
      });

      if (onMapClick) {
        map.on("click", (evt) => {
          const coords = map.getCoordinateFromPixel(evt.pixel);
          const lonLat = fromLonLat(coords);
          onMapClick(lonLat[1], lonLat[0]);
        });
      }

      mapInstance.current = map;
      vectorLayerRef.current = vectorLayer;

      // Force a resize after a short delay to ensure proper rendering
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.updateSize();
        }
      }, 200);
    } catch (err) {
      console.error("Error creating map:", err);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount - intentionally empty deps

  // 2. Center map ONLY on first valid position, then never again (unless user hasn't interacted)
  useEffect(() => {
    if (!mapInstance.current || !center) return;

    // Only center if:
    // 1. Map hasn't been initially centered yet, OR
    // 2. User hasn't manually interacted with the map
    if (!hasInitializedCenter.current && !userInteractedRef.current) {
      const view = mapInstance.current.getView();
      view.animate({
        center: fromLonLat([center.longitude, center.latitude]),
        zoom: zoom,
        duration: 500,
      });
      hasInitializedCenter.current = true;
    }
  }, [center, zoom]);

  // 3. Update features (points, vessel) when data changes
  useEffect(() => {
    if (!vectorLayerRef.current) return;
    const vectorSource = vectorLayerRef.current.getSource();
    if (!vectorSource) return;
    vectorSource.clear();

    // Draw tracks
    tracks.forEach((track) => {
      if (track.points.length > 1) {
        const coordinates = track.points.map((point) =>
          fromLonLat([point.longitude, point.latitude])
        );
        const lineFeature = new Feature({
          geometry: new LineString(coordinates),
        });
        lineFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: track.color || "#3b82f6",
              width: track.width || 3,
            }),
          })
        );
        vectorSource.addFeature(lineFeature);
      }
    });

    // Draw waypoint vessels
    waypoints.forEach((waypoint) => {
      const halfLength = vesselDimensionsMeters.length / 2;
      const halfWidth = vesselDimensionsMeters.width / 2;
      const heading = waypoint.heading || 0;
      const headingRad = (heading * Math.PI) / 180;
      
      // Debug: Log waypoint details
      console.log(`[Waypoint Render] ${waypoint.name}: Pos(${waypoint.latitude.toFixed(6)}, ${waypoint.longitude.toFixed(6)}), Heading: ${heading.toFixed(1)}°`);

      // Calculate waypoint vessel box corners
      const corners = [
        { x: -halfLength, y: -halfWidth }, // Bow-left
        { x: halfLength, y: -halfWidth },  // Stern-left  
        { x: halfLength, y: halfWidth },   // Stern-right
        { x: -halfLength, y: halfWidth },  // Bow-right
      ];

      const rotatedCorners = corners.map((corner) => {
        const rotatedX =
          corner.x * Math.cos(headingRad) - corner.y * Math.sin(headingRad);
        const rotatedY =
          corner.x * Math.sin(headingRad) + corner.y * Math.cos(headingRad);

        // Convert rotated offsets to lat/lng
        const dLat = rotatedY / 111320; // 1 degree latitude ≈ 111,320 meters
        const dLng =
          rotatedX /
          (111320 * Math.cos((waypoint.latitude * Math.PI) / 180));

        return [
          waypoint.longitude + dLng,
          waypoint.latitude + dLat,
        ];
      });

      // Close the polygon
      rotatedCorners.push(rotatedCorners[0]);

      // Convert to map projection
      const projectedCorners = rotatedCorners.map((corner) =>
        fromLonLat(corner)
      );

      const waypointVesselFeature = new Feature({
        geometry: new Polygon([projectedCorners]),
        name: waypoint.name,
      });

      waypointVesselFeature.setStyle(
        new Style({
          fill: new Fill({ color: "rgba(34, 197, 94, 0.3)" }), // More transparent green for waypoints
          stroke: new Stroke({
            color: "#16a34a", // Green border
            width: 2,
          }),
        })
      );

      vectorSource.addFeature(waypointVesselFeature);
    });

    // Draw vessel with accurate dimensions
    if (showCurrentPosition && currentPosition) {
      const halfLength = vesselDimensionsMeters.length / 2;
      const halfWidth = vesselDimensionsMeters.width / 2;
      const heading = currentPosition.heading || 0;
      const headingRad = (heading * Math.PI) / 180;
      
      // Debug: Log current vessel details
      console.log(`[Current Vessel] Pos(${currentPosition.latitude.toFixed(6)}, ${currentPosition.longitude.toFixed(6)}), Heading: ${heading.toFixed(1)}°`);

      // Calculate vessel box corners
      // Vessel length should align with heading direction (bow to stern)
      // Vessel width should be perpendicular to heading (port to starboard)
      const corners = [
        { x: -halfLength, y: -halfWidth }, // Bow-left
        { x: halfLength, y: -halfWidth },  // Stern-left  
        { x: halfLength, y: halfWidth },   // Stern-right
        { x: -halfLength, y: halfWidth },  // Bow-right
      ];

      const rotatedCorners = corners.map((corner) => {
        const rotatedX =
          corner.x * Math.cos(headingRad) - corner.y * Math.sin(headingRad);
        const rotatedY =
          corner.x * Math.sin(headingRad) + corner.y * Math.cos(headingRad);

        // Convert rotated offsets to lat/lng (actual size, no scaling)
        const dLat = rotatedY / 111320; // 1 degree latitude ≈ 111,320 meters
        const dLng =
          rotatedX /
          (111320 * Math.cos((currentPosition.latitude * Math.PI) / 180));

        return [
          currentPosition.longitude + dLng,
          currentPosition.latitude + dLat,
        ];
      });

      // Close the polygon
      rotatedCorners.push(rotatedCorners[0]);

      // Convert to map projection
      const projectedCorners = rotatedCorners.map((corner) =>
        fromLonLat(corner)
      );

      const vesselFeature = new Feature({
        geometry: new Polygon([projectedCorners]),
      });

      vesselFeature.setStyle(
        new Style({
          fill: new Fill({ color: "rgba(239, 68, 68, 0.7)" }), // Semi-transparent red for current vessel
          stroke: new Stroke({
            color: "#dc2626", // Red border
            width: 3,
          }),
        })
      );

      vectorSource.addFeature(vesselFeature);
    }
  }, [
    waypoints,
    tracks,
    showCurrentPosition,
    currentPosition,
    vesselDimensionsMeters,
  ]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ width: "100%", height: "100%", position: "relative" }}
      id="map-container"
    />
  );
}
