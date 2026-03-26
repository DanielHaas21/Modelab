import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { RootState } from '../../store/store';
import { UserStateActions } from '../../store/slices/User';
import { ALL_SERVICES, USER } from '../../middleware/ApiServices';
import { SERVICES } from '../../new_middleware/services';

/**
 * Defines auth actions
 */
interface Auth {
  googleLogin: () => void;
  changeAccount: () => void;
  logout: () => void;
}

const AuthContext = createContext<Auth | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Local storage auth key
 */
const AUTH_LS_KEY: string = 'authToken';

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return auth;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch();

  const UserData = useSelector((state: RootState) => state.User);

  // Tries to login automatically
  useEffect(() => {
    if (!UserData.auth.isAuthenticated) {
      refreshAuth();
    }
  }, []);

  // Sets the auth token to all api services
  const setToken = (token: string | null) => {
    if (token === null) {
      localStorage.removeItem(AUTH_LS_KEY);
      for (const service of ALL_SERVICES) {
        service.setToken(token);
      }
      for (const service of SERVICES) {
        service.setToken(token);
      }
    } else {
      localStorage.setItem(AUTH_LS_KEY, token);
      for (const service of ALL_SERVICES) {
        service.setToken(token);
      }
      for (const service of SERVICES) {
        service.setToken(token);
      }
    }
  };

  // Refreshes the auth data
  const refreshAuth = async () => {
    const token = UserData.auth?.authToken ?? localStorage.getItem(AUTH_LS_KEY);

    dispatch(UserStateActions.loginStart());

    if (token === null) {
      dispatch(UserStateActions.loginFailure('Invalid or missing token.'));
      return;
    }

    try {
      setToken(token);
      const { user } = await USER.getInfo();

      dispatch(UserStateActions.loginSuccess({
        user: {
          email: user.email,
          firstMame: user.givenName,
          lastName: user.familyName,
          username: `${user.givenName} ${user.familyName}`,
          picture: user.picture,
        },
        auth: {
          authToken: token,
          isAuthenticated: true,
          clearance: user.clearance,
        }
      }));
    } catch (error) {
      setToken(null);
      dispatch(UserStateActions.loginFailure('Failed to refresh auth.'));
      if (import.meta.env.DEV) {
        console.error(error);
      }
    }
  };

  // Logs in with a google auth token provided by the google button
  const loginWithToken = async (googleToken: string) => {
    dispatch(UserStateActions.loginStart());

    try {
      const { token } = await USER.login(googleToken);
      setToken(token);
      const { user } = await USER.getInfo();

      dispatch(UserStateActions.loginSuccess({
        user: {
          email: user.email,
          firstMame: user.givenName,
          lastName: user.familyName,
          username: `${user.givenName} ${user.familyName}`,
          picture: user.picture,
        },
        auth: {
          authToken: token,
          isAuthenticated: true,
          clearance: user.clearance,
        }
      }));
    } catch (error) {
      setToken(null);
      dispatch(UserStateActions.loginFailure('Failed to login.'));
      if (import.meta.env.DEV) {
        console.error(error);
      }
    }
  };

  const usedGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse: TokenResponse) => {
      loginWithToken(tokenResponse.access_token);
    },
    onError: () => {
      dispatch(UserStateActions.loginFailure('Google login failed.'));
    },
  });

  // initiates google login or dev login
  const googleLogin = () => {
    dispatch(UserStateActions.loginStart());

    if (Number(import.meta.env.VITE_DEV_LOGIN) === 1) {
      loginWithToken('dev_token');
      return;
    }

    usedGoogleLogin();
  };

  // automatically logs out and initiates new login
  const changeAccount = () => {
    logout();
    googleLogin();
  };

  // logs out
  const logout = () => {
    dispatch(UserStateActions.logout());
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      googleLogin,
      changeAccount,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
