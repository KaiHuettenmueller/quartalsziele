import { terminalTheme } from './terminal';
import { modernTheme } from './modern';
import { THEMES } from '../contexts/ThemeContext';

export const getTheme = (themeName) => {
  switch (themeName) {
    case THEMES.TERMINAL:
      return terminalTheme;
    case THEMES.MODERN:
      return modernTheme;
    default:
      return terminalTheme;
  }
};

export { terminalTheme, modernTheme };
