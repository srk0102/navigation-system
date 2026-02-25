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
import { Point, LineString, Polygon } from "ol/geom";
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import "ol/ol.css";
import "./Map.css";

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
  length: number;
  width: number;
  color?: string;
}

// Imported region: polygon area from KMZ/KML or GPS point sets
export interface MapImportedRegion {
  id: string;
  name: string;
  points: Array<{ latitude: number; longitude: number }>;
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
  importedRegions?: MapImportedRegion[];
  onMapClick?: (lat: number, lng: number) => void;
  onMapReady?: (zoomToFit: () => void) => void;
  className?: string;
}

export function MapComponent({
  center,
  zoom = 2,
  waypoints = [],
  tracks = [],
  showCurrentPosition = false,
  currentPosition,
  vesselDimensions = { length: 40, width: 16, color: "#22c55e" },
  importedRegions = [],
  onMapClick,
  onMapReady,
  className = "w-full h-full",
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorLayerRef = useRef<any>(null);
  const hasInitializedCenter = useRef<boolean>(false);
  const userInteractedRef = useRef<boolean>(false);

  const vesselDimensionsMeters = React.useMemo(
    () => ({
      length: vesselDimensions.length * 0.3048,
      width: vesselDimensions.width * 0.3048,
      color: vesselDimensions.color,
    }),
    [vesselDimensions]
  );

  // 1. Create the map ONCE
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return;

    try {
      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        zIndex: 10,
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

      map.addInteraction(new DoubleClickZoom());
      map.addInteraction(new PinchZoom());

      map.getInteractions().forEach((interaction) => {
        if (interaction.get("type") === "wheel") {
          interaction.setActive(true);
        }
      });

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

      // Provide zoom-to-fit callback
      if (onMapReady) {
        onMapReady(() => {
          if (!mapInstance.current || !vectorLayerRef.current) return;
          const source = vectorLayerRef.current.getSource();
          if (!source) return;
          const extent = source.getExtent();
          if (extent && extent.every((v: number) => isFinite(v))) {
            mapInstance.current.getView().fit(extent, {
              padding: [150, 50, 270, 50],
              duration: 1000,
              maxZoom: 18,
            });
          }
        });
      }

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
  }, []);

  // 2. Center map on first valid position
  useEffect(() => {
    if (!mapInstance.current || !center) return;

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

  // 3. Update all features when data changes
  useEffect(() => {
    if (!vectorLayerRef.current) return;
    const vectorSource = vectorLayerRef.current.getSource();
    if (!vectorSource) return;
    vectorSource.clear();

    // Draw imported regions as filled polygons with individual point markers
    importedRegions.forEach((region) => {
      if (region.points.length > 0) {
        // Draw filled polygon if enough points
        if (region.points.length >= 3) {
          const polyCoords = region.points.map((p) =>
            fromLonLat([p.longitude, p.latitude])
          );
          polyCoords.push(polyCoords[0]); // close polygon
          const polyFeature = new Feature({
            geometry: new Polygon([polyCoords]),
            name: region.name,
          });
          polyFeature.setStyle(
            new Style({
              fill: new Fill({
                color: region.color ? `${region.color}33` : "#fbbf2433",
              }),
              stroke: new Stroke({
                color: region.color || "#fbbf24",
                width: 3,
              }),
            })
          );
          vectorSource.addFeature(polyFeature);
        }

        // Draw individual points
        region.points.forEach((pt, idx) => {
          const pointFeature = new Feature({
            geometry: new Point(fromLonLat([pt.longitude, pt.latitude])),
            name: `${region.name} - Point ${idx + 1}`,
          });
          pointFeature.setStyle(
            new Style({
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({ color: region.color || "#fbbf24" }),
                stroke: new Stroke({ color: "#ffffff", width: 2 }),
              }),
            })
          );
          vectorSource.addFeature(pointFeature);
        });
      }
    });

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

      const corners = [
        { x: -halfLength, y: -halfWidth },
        { x: halfLength, y: -halfWidth },
        { x: halfLength, y: halfWidth },
        { x: -halfLength, y: halfWidth },
      ];

      const rotatedCorners = corners.map((corner) => {
        const rotatedX =
          corner.x * Math.cos(headingRad) - corner.y * Math.sin(headingRad);
        const rotatedY =
          corner.x * Math.sin(headingRad) + corner.y * Math.cos(headingRad);
        const dLat = rotatedY / 111320;
        const dLng =
          rotatedX /
          (111320 * Math.cos((waypoint.latitude * Math.PI) / 180));
        return [waypoint.longitude + dLng, waypoint.latitude + dLat];
      });

      rotatedCorners.push(rotatedCorners[0]);

      const projectedCorners = rotatedCorners.map((corner) =>
        fromLonLat(corner)
      );

      const waypointVesselFeature = new Feature({
        geometry: new Polygon([projectedCorners]),
        name: waypoint.name,
      });

      waypointVesselFeature.setStyle(
        new Style({
          fill: new Fill({ color: "rgba(34, 197, 94, 0.3)" }),
          stroke: new Stroke({ color: "#16a34a", width: 2 }),
        })
      );

      vectorSource.addFeature(waypointVesselFeature);
    });

    // Draw current vessel
    if (showCurrentPosition && currentPosition) {
      const halfLength = vesselDimensionsMeters.length / 2;
      const halfWidth = vesselDimensionsMeters.width / 2;
      const heading = currentPosition.heading || 0;
      const headingRad = (heading * Math.PI) / 180;

      const corners = [
        { x: -halfLength, y: -halfWidth },
        { x: halfLength, y: -halfWidth },
        { x: halfLength, y: halfWidth },
        { x: -halfLength, y: halfWidth },
      ];

      const rotatedCorners = corners.map((corner) => {
        const rotatedX =
          corner.x * Math.cos(headingRad) - corner.y * Math.sin(headingRad);
        const rotatedY =
          corner.x * Math.sin(headingRad) + corner.y * Math.cos(headingRad);
        const dLat = rotatedY / 111320;
        const dLng =
          rotatedX /
          (111320 * Math.cos((currentPosition.latitude * Math.PI) / 180));
        return [
          currentPosition.longitude + dLng,
          currentPosition.latitude + dLat,
        ];
      });

      rotatedCorners.push(rotatedCorners[0]);

      const projectedCorners = rotatedCorners.map((corner) =>
        fromLonLat(corner)
      );

      const vesselFeature = new Feature({
        geometry: new Polygon([projectedCorners]),
      });

      vesselFeature.setStyle(
        new Style({
          fill: new Fill({ color: "rgba(239, 68, 68, 0.7)" }),
          stroke: new Stroke({ color: "#dc2626", width: 3 }),
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
    importedRegions,
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
