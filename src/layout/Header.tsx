import React, { useState, useEffect } from "react";
import { Bell, UserCircle, Moon, Sun } from "lucide-react";

const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

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

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-all">
      <div className="text-xl font-bold flex items-center gap-2">
        <span className="text-indigo-600 dark:text-purple-400">🧬</span>
        <span>OncoVista</span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block px-3 py-1 rounded-md border text-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white"
        />
        <Bell className="w-5 h-5 hover:text-indigo-400" />
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <UserCircle className="w-6 h-6 text-gray-500 hover:text-indigo-500" />
      </div>
    </header>
  );
};

export default Header;
