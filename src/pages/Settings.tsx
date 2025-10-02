import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getMissingConfig } from "../store/slices/configSlice";
import { routes } from "../constants";

export function Settings() {
  const config = useSelector((state: RootState) => state.config);
  const missingConfig = getMissingConfig(config);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Settings
      </h1>

      {/* Configuration Error Alert */}
      {!config.isConfigured && missingConfig.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                Configuration Required
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                Please complete the following required settings to use the navigation system:
              </p>
              <ul className="mt-3 space-y-2">
                {missingConfig.map((error, index) => (
                  <li key={index} className="flex items-start text-sm text-red-700 dark:text-red-300">
                    <span className="mr-2">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link
                  to={routes.configuration}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                >
                  Complete Configuration
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Success Alert */}
      {config.isConfigured && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">
                Configuration Complete
              </h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                All required settings have been configured. Your navigation system is ready to use.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            System Configuration
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Configure your boat dimensions and sensor connections.
          </p>
          <Link
            to={routes.configuration}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Open Configuration
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Other Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Additional system settings will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}
