import { createContext, useContext } from 'react';

/**
 * Defines auth actions
 */
interface Auth {
  googleLogin: () => void;
  changeAccount: () => void;
  logout: () => void;
}

export const AuthContext = createContext<Auth | null>(null);

/**
 * Local storage auth key
 */
export const AUTH_LS_KEY: string = 'authToken';

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return auth;
}
