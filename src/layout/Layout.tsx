import { useEffect } from 'react';
import { useLayout } from '@/context/LayoutContext';
import { Sidebar } from './Sidebar';
import Header from './Header'; // Import the Header component
import { useWindowWidth } from '@react-hook/window-size';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { sidebarCollapsed, toggleSidebar } = useLayout();
  const windowWidth = useWindowWidth();

  // Auto-collapse on mobile
  useEffect(() => {
    if (windowWidth < 768 && !sidebarCollapsed) {
      toggleSidebar();
    }
  }, [windowWidth]);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#004D61] via-[#005B8F] to-[#3B1D74] text-white transition-colors duration-300">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
};
