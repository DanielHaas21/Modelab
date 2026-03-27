import { useEffect, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import { ALL_THEME_MODES, ThemeMode } from '../../../store/types';

const LS_THEME_KEY = 'theme-current-theme' as const;

const getThemeIndex = (theme: string) => ALL_THEME_MODES.findIndex((otherTheme) => otherTheme === theme);
const getStoredIndex = (defaultValue: number) => {
  const stored = getThemeIndex(localStorage.getItem(LS_THEME_KEY) ?? '');
  if (!isFinite(stored) || stored < 0 || stored >= ALL_THEME_MODES.length) return defaultValue;
  return stored;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(ALL_THEME_MODES[0]);

  useEffect(() => {
    const currentIndex = getThemeIndex(theme);
    const storedIndex = getStoredIndex(currentIndex);

    changeTheme(ALL_THEME_MODES[storedIndex]);
  }, [theme]);

  const changeTheme = (theme: ThemeMode) => {
    setTheme(theme);
    localStorage.setItem(LS_THEME_KEY, theme);

    const root = window.document.documentElement;
    root.classList.remove(...ALL_THEME_MODES);
    root.classList.add(theme);
  };

  const cycleThemes = () => {
    const currentThemeIndex = ALL_THEME_MODES.findIndex((otherTheme) => otherTheme === theme);
    changeTheme(ALL_THEME_MODES[(currentThemeIndex + 1) % ALL_THEME_MODES.length]);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      cycleThemes,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
