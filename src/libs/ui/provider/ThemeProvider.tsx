import { useTheme } from '../../hooks/useTheme';

// This file contains the ThemeProvider component, which is used to provide the theme context to the entire application. It also contains the useTheme hook, which is used to access the theme context in the application.
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useTheme();
  return <>{children}</>;
};
