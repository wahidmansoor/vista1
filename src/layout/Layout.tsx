import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar onHoverChange={setIsSidebarHovered} />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarHovered ? "ml-64" : "ml-20"
        }`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet key={location.pathname} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
