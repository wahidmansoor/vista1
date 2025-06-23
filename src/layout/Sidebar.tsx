import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLayout } from '@/context/LayoutContext';

const navItems = [
  { path: "/search", label: "Search", icon: "/icons/search.svg" },
  { path: "/opd", label: "OPD", icon: "/icons/opd.png" },
  { path: "/cdu", label: "CDU", icon: "/icons/cdu.png" },
  { path: "/inpatient", label: "Inpatient", icon: "/icons/inpatient.png" },
  { path: "/palliative", label: "Palliative", icon: "/icons/palliative.png" },
  { path: "/tools", label: "Tools", icon: "/icons/tools.png" },
  { path: "/handbook", label: "Handbook", icon: "/icons/handbook.png" }
];

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useLayout();
  const navigate = useNavigate();

  return (
    <div
      className={`
        fixed md:static top-0 left-0 h-screen
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
        z-40 transition-all duration-300 ease-in-out
        bg-white/70 dark:bg-slate-900/90 backdrop-blur-md 
        border-r border-slate-200 dark:border-slate-800
        shadow-xl flex flex-col
      `}
    >
      {/* Header / Toggle */}
      <div className="flex items-center justify-between px-4 py-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer"
          onClick={() => navigate('/')}

        >
          <img
            src="/icons/mine.png"
            alt="OncoVista Logo"
            className={`
              transition-all duration-300
              ${sidebarCollapsed ? 'w-8' : 'w-12'}
              h-auto rounded-full
              drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]
              dark:drop-shadow-[0_4px_8px_rgba(255,255,255,0.15)]
              hover:drop-shadow-[0_6px_12px_rgba(124,58,237,0.6)]
            `}
          />
        </motion.div>
        <button onClick={toggleSidebar} className="text-slate-500 dark:text-slate-300">
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-2 mt-4">
        {navItems.map(({ path, label, icon }) => (
          <TooltipProvider delayDuration={0} key={path}>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to={path}>
                  {({ isActive }) => (
                    <div
                      className={`relative group flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.7)]'
                          : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-white/10'}
                      `}
                    >
                      <div className="relative flex items-center justify-center min-w-[44px] min-h-[44px]">
                        {isActive && (
                          <div className="absolute inset-0 rounded-full blur-lg bg-purple-500/30 scale-125 opacity-80" />
                        )}
                        <img
                          src={icon}
                          alt={label}
                          title={label}
                          aria-label={label}
                          className={`w-10 h-10 relative z-10 object-contain transition-all duration-300
                                    ${isActive 
                                      ? 'drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]' 
                                      : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_2px_4px_rgba(255,255,255,0.15)]'}
                                    group-hover:drop-shadow-[0_4px_8px_rgba(124,58,237,0.6)] group-hover:scale-110`} 
                        />
                      </div>
                      {!sidebarCollapsed && (
                        <span className="font-medium text-sm">
                          {label}
                        </span>
                      )}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 bg-purple-500 rounded-r-md shadow-md" />
                      )}
                    </div>
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs px-2 py-1">
                {sidebarCollapsed && label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>

      {/* Glowing Bottom Decoration */}
      <div className="mt-auto mb-4 mx-auto w-8 h-8 rounded-full bg-purple-700/50 blur-xl" />
    </div>
  );
};
