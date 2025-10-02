import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { useEffect } from 'react'
import { saveToStorage } from '../store/slices/configSlice'

interface ConfigurationGuardProps {
  children: React.ReactNode
}

export function ConfigurationGuard({ children }: ConfigurationGuardProps) {
  const dispatch = useDispatch()
  const { isConfigured } = useSelector((state: RootState) => state.config)

  // Save to storage whenever config changes
  useEffect(() => {
    dispatch(saveToStorage())
  }, [dispatch, isConfigured])

  if (!isConfigured) {
    return <ConfigurationRequired />
  }

  return <>{children}</>
}

function ConfigurationRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <svg
              className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            Configuration Required
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Please complete the system configuration before using the navigation system.
          </p>
          <div className="mt-6">
            <a
              href="/settings"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Settings
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
