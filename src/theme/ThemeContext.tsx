import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types/settings';

interface ThemeContextType {
  theme: ThemeMode;
  activeTheme: 'dark' | 'light' | 'warm-cream';
  setTheme: (theme: ThemeMode) => void;
  enable3D: boolean;
  setEnable3D: (enable: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('mocktracker_theme') as ThemeMode;
    return saved || 'dark';
  });

  const [enable3D, setEnable3DState] = useState<boolean>(() => {
    const saved = localStorage.getItem('mocktracker_3d');
    return saved !== null ? saved === 'true' : true;
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    const saved = localStorage.getItem('mocktracker_reduced_motion');
    return saved !== null ? saved === 'true' : false;
  });

  const [activeTheme, setActiveTheme] = useState<'dark' | 'light' | 'warm-cream'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'warm-cream');

    let resolved: 'dark' | 'light' | 'warm-cream' = 'dark';
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = theme;
    }

    root.classList.add(resolved);
    setActiveTheme(resolved);
    localStorage.setItem('mocktracker_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setEnable3D = (enable: boolean) => {
    setEnable3DState(enable);
    localStorage.setItem('mocktracker_3d', String(enable));
  };

  const setReducedMotion = (reduced: boolean) => {
    setReducedMotionState(reduced);
    localStorage.setItem('mocktracker_reduced_motion', String(reduced));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        activeTheme,
        setTheme,
        enable3D,
        setEnable3D,
        reducedMotion,
        setReducedMotion
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
