import { configureStore } from '@reduxjs/toolkit'
import { configSlice } from './slices/configSlice'
import { navigationSlice } from './slices/navigationSlice'

export const store = configureStore({
  reducer: {
    config: configSlice.reducer,
    navigation: navigationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['config/loadFromStorage', 'config/saveToStorage'],
        ignoredPaths: ['navigation.currentPosition.timestamp', 'navigation.waypoints'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
