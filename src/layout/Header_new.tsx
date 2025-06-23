import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HandbookSearch } from "@/components/HandbookSearch";

/**
 * Global header component for OncoVista that appears on every page
 * Shows welcome message, live clock, search functionality, and dark mode toggle
 */
const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const navigate = useNavigate();

  // Handle dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Setup live-updating clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAuthClick = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-900 dark:to-blue-800 text-white shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo & Welcome message */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-white">🧬</span>
            <h1 className="text-xl font-semibold hidden sm:block">
              Welcome to OncoVista
            </h1>
          </div>

          {/* Center - Search and Live clock */}
          <div className="flex items-center gap-6">
            {/* Quick Search */}
            <div className="hidden lg:block relative">
              {showQuickSearch ? (
                <div className="relative">
                  <HandbookSearch 
                    placeholder="Quick search..."
                    showFilters={false}
                    className="w-64"
                    onResultSelect={() => setShowQuickSearch(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setShowQuickSearch(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Quick search"
                >
                  <Search className="h-4 w-4" />
                  <span className="text-sm">Search...</span>
                </button>
              )}
            </div>

            {/* Search Icon for smaller screens */}
            <button
              onClick={handleSearchClick}
              className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Search handbook"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Live clock */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm">🕐</span>
              <div className="text-xl font-medium">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Right side - Simple toggles */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              onClick={handleAuthClick}
              className="inline-flex items-center px-4 py-2 rounded-md 
                       text-sm font-medium bg-blue-700 hover:bg-blue-800 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       dark:bg-blue-600 dark:hover:bg-blue-700
                       transition-colors duration-200"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>

      {/* Quick search overlay */}
      {showQuickSearch && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setShowQuickSearch(false)}
        />
      )}
    </header>
  );
};

export default Header;
