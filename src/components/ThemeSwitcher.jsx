import { Monitor, Palette } from 'lucide-react';
import { useTheme, THEMES } from '../contexts/ThemeContext';
import { getTheme } from '../themes';

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = getTheme(theme);
  const isTerminal = theme === THEMES.TERMINAL;

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-4 py-2 transition-all ${
        isTerminal 
          ? currentTheme.button.secondary
          : currentTheme.button.secondary
      }`}
      title={`Switch to ${isTerminal ? 'Modern' : 'Terminal'} theme`}
    >
      {isTerminal ? <Palette className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
      <span className="text-sm font-semibold">
        {isTerminal ? 'Modern' : 'Terminal'}
      </span>
    </button>
  );
}

export default ThemeSwitcher;
