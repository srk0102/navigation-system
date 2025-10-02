import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { navigation } from "../constants";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Apply dark class based on saved theme or system preference
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);

    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Disclosure
      as="nav"
      className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                  Navigation System
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-all duration-200 hover:scale-105 ${
                      isActive
                        ? "border-blue-500 text-gray-900 dark:text-white"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Theme toggle and mobile menu */}
          <div className="flex items-center space-x-1" onClick={toggleTheme}>
            {/* Theme Toggle */}
            <button
              className={`rounded-full p-2 transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "text-yellow-500 bg-gray-700 hover:bg-gray-700"
                  : "text-gray-200 bg-gray-800 hover:bg-gray-800"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <span className="flex items-center gap-2">
                  <SunIcon className="h-5 w-5 transition-transform duration-200" />
                  Light
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <MoonIcon className="h-5 w-5 transition-transform duration-200" />
                  Dark
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <DisclosureButton className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              </DisclosureButton>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <DisclosurePanel className="sm:hidden transition-all duration-200">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.href}
                className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 transition-all duration-200 ${
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                }`}
              >
                {item.name}
              </DisclosureButton>
            );
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
