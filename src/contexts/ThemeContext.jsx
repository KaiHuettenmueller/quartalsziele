import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  TERMINAL: 'terminal',
  MODERN: 'modern',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('jsa_theme');
    return saved || THEMES.TERMINAL;
  });

  useEffect(() => {
    localStorage.setItem('jsa_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === THEMES.TERMINAL ? THEMES.MODERN : THEMES.TERMINAL);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
