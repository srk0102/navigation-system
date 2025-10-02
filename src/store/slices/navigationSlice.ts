import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Waypoint {
  id: string
  name: string
  latitude: number
  longitude: number
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

export interface NavigationState {
  currentPosition: Position | null
  waypoints: Waypoint[]
  isNavigating: boolean
  currentPath: NavigationPath | null
  savedRoutes: NavigationPath[]
  connectionStatus: {
    primaryGNSS: boolean
    secondaryGNSS: boolean
    imu: boolean
  }
}

const initialState: NavigationState = {
  currentPosition: null,
  waypoints: [],
  isNavigating: false,
  currentPath: null,
  savedRoutes: [],
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
      // Do NOT push to currentPath.trackPoints here (keep in memory, not Redux)
    },
    addWaypoint: (state, action: PayloadAction<Omit<Waypoint, 'id' | 'timestamp'>>) => {
      state.waypoints.push({
        ...action.payload,
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
      // Only set up currentPath meta, do not store trackPoints in Redux
      state.currentPath = {
        id: `path-${Date.now()}`,
        name: `Route ${new Date().toLocaleDateString()}`,
        startTime: new Date().toISOString(),
        endTime: null,
        waypoints: [...state.waypoints],
        trackPoints: [], // Will be filled in memory, not Redux
        distance: 0,
        duration: 0,
      }
    },
    stopNavigation: (state) => {
      state.isNavigating = false
      // Only finalize meta, do not store trackPoints in Redux
      if (state.currentPath) {
        state.currentPath.endTime = new Date().toISOString()
        // duration calculation can be done on export
        state.savedRoutes.push(state.currentPath)
        state.currentPath = null
      }
    },
    updateConnectionStatus: (state, action: PayloadAction<Partial<NavigationState['connectionStatus']>>) => {
      state.connectionStatus = { ...state.connectionStatus, ...action.payload }
    },
    importRoute: (state, action: PayloadAction<NavigationPath>) => {
      state.savedRoutes.push(action.payload)
    },
    deleteRoute: (state, action: PayloadAction<string>) => {
      state.savedRoutes = state.savedRoutes.filter(route => route.id !== action.payload)
    },
  },
})

export const {
  updatePosition,
  addWaypoint,
  removeWaypoint,
  clearWaypoints,
  startNavigation,
  stopNavigation,
  updateConnectionStatus,
  importRoute,
  deleteRoute,
} = navigationSlice.actions

export default navigationSlice.reducer


