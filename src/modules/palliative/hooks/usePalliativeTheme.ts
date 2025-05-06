import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  error: string;
  warning: string;
  success: string;
}

const themes: Record<Exclude<Theme, 'system'>, ThemeColors> = {
  light: {
    primary: '#4f46e5',
    secondary: '#6b7280',
    accent: '#8b5cf6',
    background: '#ffffff',
    text: '#111827',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981'
  },
  dark: {
    primary: '#818cf8',
    secondary: '#9ca3af',
    accent: '#a78bfa',
    background: '#1f2937',
    text: '#f9fafb',
    error: '#f87171',
    warning: '#fbbf24',
    success: '#34d399'
  }
};

export const usePalliativeTheme = (defaultTheme: Theme = 'system') => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('palliative_theme');
    return (saved as Theme) || defaultTheme;
  });

  const [colors, setColors] = useState<ThemeColors>(() => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return themes[isDark ? 'dark' : 'light'];
    }
    return themes[theme];
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setColors(themes[mediaQuery.matches ? 'dark' : 'light']);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('palliative_theme', theme);
    
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColors(themes[isDark ? 'dark' : 'light']);
    } else {
      setColors(themes[theme]);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => {
      switch (current) {
        case 'light': return 'dark';
        case 'dark': return 'system';
        case 'system': return 'light';
      }
    });
  };

  return {
    theme,
    colors,
    setTheme,
    toggleTheme
  };
};