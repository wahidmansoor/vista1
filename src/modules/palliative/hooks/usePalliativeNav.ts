import { useState, useEffect } from 'react';

const STORAGE_KEY = 'palliative_active_tab';

export const usePalliativeNav = (defaultTab: string) => {
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || defaultTab;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeTab);
  }, [activeTab]);

  const handleTabChange = (newTab: string) => {
    setIsTransitioning(true);
    setActiveTab(newTab);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const resetNavigation = () => {
    setActiveTab(defaultTab);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    activeTab,
    isTransitioning,
    handleTabChange,
    resetNavigation
  };
};