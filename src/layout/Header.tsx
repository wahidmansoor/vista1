import React, { useState, useEffect } from "react";
import { LogIn, LogOut, Moon, Sun, Clock } from "lucide-react";

/**
 * Global header component for OncoVista that appears on every page
 * Shows welcome message, live clock, dark mode toggle, and authentication status
 * 
 * TODO: Replace mock authentication with Supabase auth:
 * 1. Import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
 * 2. Replace isLoggedIn state with useUser() hook
 * 3. Replace handleAuthClick with actual Supabase signIn/signOut methods
 */
const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [currentTime, setCurrentTime] = useState(new Date());
  // Mock authentication state - replace with Supabase auth later
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  // Mock auth handler - replace with Supabase auth later
  const handleAuthClick = () => {
    setIsLoggedIn(!isLoggedIn);
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

          {/* Center - Live clock */}
          <div className="hidden md:flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <div className="text-xl font-medium">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>

          {/* Right side - Dark mode & Auth buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={handleAuthClick}
              className="inline-flex items-center px-4 py-2 rounded-md 
                       text-sm font-medium bg-blue-700 hover:bg-blue-800 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       dark:bg-blue-600 dark:hover:bg-blue-700
                       transition-colors duration-200"
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
