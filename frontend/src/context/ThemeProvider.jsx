import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const colorScheme = 'Dark';
  const resolvedTheme = 'dark';
  const setColorScheme = () => {};

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useColorScheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useColorScheme must be used inside a ThemeProvider');
  return context;
};
