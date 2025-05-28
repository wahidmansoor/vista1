import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { HandbookSearch } from "@/components/HandbookSearch";
import { CommonIcons } from "@/utils/iconUtils";
import LoginButton from '@/components/LoginButton';
import LogoutButton from '@/components/LogoutButton';
import AutoLogoutStatus from '@/components/AutoLogoutStatus';

/**
 * Global header component for OncoVista that appears on every page
 * Shows welcome message, live clock, dark mode toggle, and Auth0 authentication status
 */
const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth0();

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
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"                  title="Quick search"
                >
                  <CommonIcons.Search className="h-4 w-4" />
                  <span className="text-sm">Search...</span>
                </button>
              )}
            </div>

            {/* Search Icon for smaller screens */}
            <button
              onClick={handleSearchClick}
              className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"              title="Search handbook"
            >
              <CommonIcons.Search className="h-5 w-5" />
            </button>{/* Live clock */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-lg">🕒</span>
              <div className="text-xl font-medium">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>          {/* Right side - Dark mode & Auth buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="text-lg">{darkMode ? "☀️" : "🌙"}</span>
            </button>            {/* Authentication Section */}
            {isLoading ? (
              <div className="text-white/80">Loading...</div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Auto-logout status */}
                <AutoLogoutStatus />
                
                <span className="text-white/90 hidden sm:block">
                  Welcome, {user?.name || user?.email}
                </span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                >
                  Dashboard
                </button>
                <LogoutButton className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200" />
              </div>
            ) : (
              <LoginButton className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" />
            )}
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
