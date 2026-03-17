import { createContext, useContext } from 'react';
import { ThemeMode } from '../../store/types';

interface ThemeType {
  theme: ThemeMode;
  cycleThemes: () => void;
}

export const ThemeContext = createContext<ThemeType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemne must be used inside <ThemeProvider/>');
  return ctx;
};
