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

// Reference route loaded from a past JSON file, shown as track overlay
export interface ReferenceRoute {
  id: string
  name: string
  trackPoints: Array<{ latitude: number; longitude: number }>
  color: string
}

// Imported region from KMZ/KML or GPS point sets, rendered as filled polygon
export interface ImportedRegion {
  id: string
  name: string
  points: Array<{ latitude: number; longitude: number }>
  color: string
  timestamp: string
}

// Continued session: resume a previous navigation with its data visible
export interface ContinuedSession {
  trackPoints: Position[]
  waypoints: Waypoint[]
  sessionName: string
  sessionDate: string
}

// Colors for reference routes
const REFERENCE_COLORS = [
  '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4',
  '#84cc16', '#f97316', '#14b8a6', '#e11d48',
]

export interface NavigationState {
  currentPosition: Position | null
  waypoints: Waypoint[]
  isNavigating: boolean
  currentPath: NavigationPath | null
  savedRoutes: NavigationPath[]
  referenceRoutes: ReferenceRoute[]
  importedRegions: ImportedRegion[]
  continuedSession: ContinuedSession | null
  connectionStatus: {
    primaryGNSS: boolean
    secondaryGNSS: boolean
    imu: boolean
  }
}

// Load saved routes from localStorage on startup
function loadSavedRoutes(): NavigationPath[] {
  try {
    const stored = localStorage.getItem('navigation_savedRoutes')
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.error('Failed to load saved routes from localStorage:', e)
  }
  return []
}

function persistSavedRoutes(routes: NavigationPath[]) {
  try {
    localStorage.setItem('navigation_savedRoutes', JSON.stringify(routes))
  } catch (e) {
    console.error('Failed to persist saved routes to localStorage:', e)
  }
}

const initialState: NavigationState = {
  currentPosition: null,
  waypoints: [],
  isNavigating: false,
  currentPath: null,
  savedRoutes: loadSavedRoutes(),
  referenceRoutes: [],
  importedRegions: [],
  continuedSession: null,
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

    // Reference routes: past JSON navigation files as track overlays
    addReferenceRoute: (state, action: PayloadAction<{ name: string; trackPoints: Array<{ latitude: number; longitude: number }> }>) => {
      const colorIndex = state.referenceRoutes.length % REFERENCE_COLORS.length
      state.referenceRoutes.push({
        id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: action.payload.name,
        trackPoints: action.payload.trackPoints,
        color: REFERENCE_COLORS[colorIndex],
      })
    },
    removeReferenceRoute: (state, action: PayloadAction<string>) => {
      state.referenceRoutes = state.referenceRoutes.filter(r => r.id !== action.payload)
    },
    clearReferenceRoutes: (state) => {
      state.referenceRoutes = []
    },

    // Imported regions: KMZ/KML GPS polygon areas rendered as filled regions on map
    addImportedRegion: (state, action: PayloadAction<ImportedRegion>) => {
      state.importedRegions.push(action.payload)
    },
    removeImportedRegion: (state, action: PayloadAction<string>) => {
      state.importedRegions = state.importedRegions.filter(r => r.id !== action.payload)
    },
    clearImportedRegions: (state) => {
      state.importedRegions = []
    },

    // Continued session: load a previous session's data to display during new navigation
    setContinuedSession: (state, action: PayloadAction<ContinuedSession>) => {
      state.continuedSession = action.payload
    },
    clearContinuedSession: (state) => {
      state.continuedSession = null
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
  addImportedRegion,
  removeImportedRegion,
  clearImportedRegions,
  setContinuedSession,
  clearContinuedSession,
} = navigationSlice.actions

export default navigationSlice.reducer
