import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Stethoscope, Syringe, Hospital,
  HeartPulse, Settings, Power, Pin, PinOff, Sun, Moon,
} from "lucide-react";

interface SidebarProps {
  onHoverChange: (hovered: boolean) => void;
}

const navItems = [
  { name: "AI Handbook", path: "/handbook", icon: BookOpen },
  { name: "OPD", path: "/opd", icon: Stethoscope },
  { name: "CDU", path: "/cdu", icon: Syringe },
  { name: "Inpatient", path: "/inpatient", icon: Hospital },
  { name: "Palliative", path: "/palliative", icon: HeartPulse },
  { name: "Tools", path: "/tools", icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ onHoverChange }) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [pinned, setPinned] = useState(() => localStorage.getItem("sidebarPinned") === "true");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  const isExpanded = pinned || isHovered;

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const togglePinned = () => {
    const newPin = !pinned;
    setPinned(newPin);
    localStorage.setItem("sidebarPinned", String(newPin));
  };

  return (
    <aside
      onMouseEnter={() => {
        if (!pinned) {
          setIsHovered(true);
          onHoverChange(true);
        }
      }}
      onMouseLeave={() => {
        if (!pinned) {
          setIsHovered(false);
          onHoverChange(false);
        }
      }}
      className={
        "fixed top-0 left-0 h-screen z-50 " +
        "transition-all duration-500 ease-in-out " +
        "shadow-xl overflow-hidden flex flex-col " +
        (isExpanded ? "w-64" : "w-20") +
        " text-gray-900 dark:text-white " +
        "bg-gradient-to-b " +
        "from-white via-gray-100 to-white " +
        "dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 " +
        "border-r border-gray-300 dark:border-gray-700"
      }
    >
      <div className="p-4 text-xl font-bold transition-opacity duration-300">
        <span className={isExpanded ? "opacity-100" : "opacity-0"}>OncoVista</span>
        {!isExpanded && <span className="transition-opacity opacity-100">🧬</span>}
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navItems.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <Link
              key={name}
              to={path}
              className={
                "flex items-center gap-4 px-3 py-2 rounded-md transition-all " +
                (isActive
                  ? "bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500 text-white"
                  : "hover:bg-black/10 dark:hover:bg-white/10") +
                " group"
              }
            >
              <Icon className="w-5 h-5 shrink-0 transition-all" />
              <span
                className={
                  "whitespace-nowrap overflow-hidden transition-all duration-300 origin-left " +
                  (isExpanded ? "opacity-100 scale-100 ml-1" : "opacity-0 scale-0 ml-0")
                }
              >
                {name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 flex flex-col gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 w-full transition-all"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span
            className={
              "whitespace-nowrap transition-all " +
              (isExpanded ? "opacity-100 ml-1" : "opacity-0 ml-0")
            }
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        <button
          onClick={togglePinned}
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 w-full transition-all"
        >
          {pinned ? <Pin className="w-5 h-5" /> : <PinOff className="w-5 h-5" />}
          <span
            className={
              "whitespace-nowrap transition-all " +
              (isExpanded ? "opacity-100 ml-1" : "opacity-0 ml-0")
            }
          >
            {pinned ? "Unpin" : "Pin Sidebar"}
          </span>
        </button>

        <button
          onClick={() => alert("Logging out...")}
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 w-full transition-all"
        >
          <Power className="w-5 h-5" />
          <span
            className={
              "whitespace-nowrap transition-all " +
              (isExpanded ? "opacity-100 ml-1" : "opacity-0 ml-0")
            }
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
