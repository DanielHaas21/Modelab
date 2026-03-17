import { useEffect, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import { ALL_THEME_MODES, ThemeMode } from '../../../store/types';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(ALL_THEME_MODES[0]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(...ALL_THEME_MODES);
    root.classList.add(theme);
  }, [theme]);

  const cycleThemes = () => {
    const currentThemeIndex = ALL_THEME_MODES.findIndex((otherTheme) => otherTheme === theme);
    setTheme(ALL_THEME_MODES[(currentThemeIndex + 1) % ALL_THEME_MODES.length]);
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
