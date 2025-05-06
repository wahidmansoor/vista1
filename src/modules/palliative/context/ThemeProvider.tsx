import React, { createContext, useContext } from 'react';
import { usePalliativeTheme } from '../hooks/usePalliativeTheme';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    error: string;
    warning: string;
    success: string;
  };
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const PalliativeThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: Theme;
}> = ({ children, defaultTheme = 'system' }) => {
  const themeContext = usePalliativeTheme(defaultTheme);

  return (
    <ThemeContext.Provider value={themeContext}>
      <div style={{
        colorScheme: themeContext.theme === 'system' 
          ? 'light dark' 
          : themeContext.theme
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const usePalliativeThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('usePalliativeThemeContext must be used within a PalliativeThemeProvider');
  }
  return context;
};