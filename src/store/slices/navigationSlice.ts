import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Waypoint {
  id: string
  name: string
  latitude: number
  longitude: number
  heading: number
  timestamp: string // ISO string
}

export interface Position {
  latitude: number
  longitude: number
  heading: number
  elevation: number
  speed: number
  accuracy: number
  timestamp: string // ISO string
}

export interface NavigationPath {
  id: string
  name: string
  startTime: string // ISO string
  endTime: string | null // ISO string or null
  waypoints: Waypoint[]
  trackPoints: Position[]
  distance: number
  duration: number
}

// A reference route loaded from a past JSON file, shown as overlay during navigation
export interface ReferenceRoute {
  id: string
  name: string
  trackPoints: Array<{ latitude: number; longitude: number }>
  color: string
}

// Colors for reference routes so they are visually distinct
const REFERENCE_COLORS = [
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#14b8a6', // teal
  '#e11d48', // rose
];

export interface NavigationState {
  currentPosition: Position | null
  waypoints: Waypoint[]
  isNavigating: boolean
  currentPath: NavigationPath | null
  savedRoutes: NavigationPath[]
  referenceRoutes: ReferenceRoute[] // past routes loaded as overlays during navigation
  connectionStatus: {
    primaryGNSS: boolean
    secondaryGNSS: boolean
    imu: boolean
  }
}

// Load saved routes from localStorage on startup
function loadSavedRoutes(): NavigationPath[] {
  try {
    const stored = localStorage.getItem('navigation_savedRoutes');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load saved routes from localStorage:', e);
  }
  return [];
}

// Persist saved routes to localStorage
function persistSavedRoutes(routes: NavigationPath[]) {
  try {
    localStorage.setItem('navigation_savedRoutes', JSON.stringify(routes));
  } catch (e) {
    console.error('Failed to persist saved routes to localStorage:', e);
  }
}

const initialState: NavigationState = {
  currentPosition: null,
  waypoints: [],
  isNavigating: false,
  currentPath: null,
  savedRoutes: loadSavedRoutes(),
  referenceRoutes: [],
  connectionStatus: {
    primaryGNSS: false,
    secondaryGNSS: false,
    imu: false,
  },
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    updatePosition: (state, action: PayloadAction<Position>) => {
      state.currentPosition = action.payload
    },
    addTrackPoint: (state, action: PayloadAction<Position>) => {
      if (state.currentPath) {
        state.currentPath.trackPoints.push(action.payload)
      }
    },
    addWaypoint: (state, action: PayloadAction<Omit<Waypoint, 'id' | 'timestamp'>>) => {
      state.waypoints.push({
        ...action.payload,
        heading: action.payload.heading || 0,
        id: `wp-${Date.now()}`,
        timestamp: new Date().toISOString(),
      })
    },
    removeWaypoint: (state, action: PayloadAction<string>) => {
      state.waypoints = state.waypoints.filter(wp => wp.id !== action.payload)
    },
    clearWaypoints: (state) => {
      state.waypoints = []
    },
    startNavigation: (state) => {
      state.isNavigating = true
      state.currentPath = {
        id: `path-${Date.now()}`,
        name: `Route ${new Date().toLocaleDateString()}`,
        startTime: new Date().toISOString(),
        endTime: null,
        waypoints: [...state.waypoints],
        trackPoints: [],
        distance: 0,
        duration: 0,
      }
    },
    stopNavigation: (state) => {
      state.isNavigating = false
      if (state.currentPath) {
        state.currentPath.endTime = new Date().toISOString()
        state.savedRoutes.push(state.currentPath)
        persistSavedRoutes(state.savedRoutes)
        state.currentPath = null
      }
    },
    updateConnectionStatus: (state, action: PayloadAction<Partial<NavigationState['connectionStatus']>>) => {
      state.connectionStatus = { ...state.connectionStatus, ...action.payload }
    },
    importRoute: (state, action: PayloadAction<NavigationPath>) => {
      state.savedRoutes.push(action.payload)
      persistSavedRoutes(state.savedRoutes)
    },
    deleteRoute: (state, action: PayloadAction<string>) => {
      state.savedRoutes = state.savedRoutes.filter(route => route.id !== action.payload)
      persistSavedRoutes(state.savedRoutes)
    },

    // Reference routes: load past navigation files as overlays during live navigation
    addReferenceRoute: (state, action: PayloadAction<{ name: string; trackPoints: Array<{ latitude: number; longitude: number }> }>) => {
      const colorIndex = state.referenceRoutes.length % REFERENCE_COLORS.length;
      state.referenceRoutes.push({
        id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: action.payload.name,
        trackPoints: action.payload.trackPoints,
        color: REFERENCE_COLORS[colorIndex],
      });
    },
    removeReferenceRoute: (state, action: PayloadAction<string>) => {
      state.referenceRoutes = state.referenceRoutes.filter(r => r.id !== action.payload)
    },
    clearReferenceRoutes: (state) => {
      state.referenceRoutes = []
    },
  },
})

export const {
  updatePosition,
  addTrackPoint,
  addWaypoint,
  removeWaypoint,
  clearWaypoints,
  startNavigation,
  stopNavigation,
  updateConnectionStatus,
  importRoute,
  deleteRoute,
  addReferenceRoute,
  removeReferenceRoute,
  clearReferenceRoutes,
} = navigationSlice.actions

export default navigationSlice.reducer
