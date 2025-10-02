import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Navigation, MarineRoutes, Settings, Configuration, NotFound } from "./pages";
import { Navbar, ConfigurationGuard } from "./components";
import { routes } from "./constants";

function App() {

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900`}>
        <Navbar />
        <main>
          <Routes>
            <Route path={routes.configuration} element={<Configuration />} />
            <Route path={routes.home} element={
              <ConfigurationGuard>
                <Home />
              </ConfigurationGuard>
            } />
            <Route path={routes.navigation} element={
              <ConfigurationGuard>
                <Navigation />
              </ConfigurationGuard>
            } />
            <Route path={routes.marineRoutes} element={
              <ConfigurationGuard>
                <MarineRoutes />
              </ConfigurationGuard>
            } />
            <Route path={routes.settings} element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
