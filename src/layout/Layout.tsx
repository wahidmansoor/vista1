import { useEffect } from 'react';
import { useLayout } from '@/context/LayoutContext';
import { Sidebar } from './Sidebar';
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
    <div className="flex min-h-screen bg-background text-gray-900 dark:text-white transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};
