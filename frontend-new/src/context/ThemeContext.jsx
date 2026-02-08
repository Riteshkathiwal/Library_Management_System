import React, { createContext, useState, useEffect, useContext } from 'react';
import { THEMES, THEME_COLORS } from '../constants/theme';
import { STORAGE_KEYS } from '../constants';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    return savedTheme || THEMES.LIGHT;
  });

  const colors = THEME_COLORS[theme];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.body.setAttribute('data-theme', theme);
    
    // Apply theme colors to CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  }, [theme, colors]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT));
  };

  const value = {
    theme,
    colors,
    toggleTheme,
    isDark: theme === THEMES.DARK,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
