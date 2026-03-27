import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { RootState } from '../../store/store';
import { UserStateActions } from '../../store/slices/User';
import { SERVICES, USER } from '../../middleware/services';
import { AUTH_LS_KEY, AuthContext } from '../hooks';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch();

  const UserData = useSelector((state: RootState) => state.User);

  // Sets the auth token to all api services
  const setToken = useCallback((token: string | null) => {
    if (token === null) {
      localStorage.removeItem(AUTH_LS_KEY);
      for (const service of SERVICES) {
        service.setToken(token);
      }
    } else {
      localStorage.setItem(AUTH_LS_KEY, token);
      for (const service of SERVICES) {
        service.setToken(token);
      }
    }
  }, []);

  // Refreshes the auth data
  const refreshAuth = useCallback(async () => {
    const token = localStorage.getItem(AUTH_LS_KEY);

    if (!token) {
      dispatch(UserStateActions.loginFailure('Invalid or missing token.'));
      return;
    }

    dispatch(UserStateActions.loginStart());

    try {
      setToken(token);
      const { user } = await USER.info();

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
  }, [dispatch, setToken]);

  // Logs in with a google auth token provided by the google button
  const loginWithToken = async (googleToken: string) => {
    dispatch(UserStateActions.loginStart());

    try {
      const { token } = await USER.login({ accessToken: googleToken });
      setToken(token);
      const { user } = await USER.info();

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

  // auto refreshes
  useEffect(() => {
    const hasStoredToken = Boolean(localStorage.getItem(AUTH_LS_KEY));
    if (!UserData.auth?.isAuthenticated && hasStoredToken) {
      refreshAuth();
    }
  }, [UserData.auth?.isAuthenticated, refreshAuth]);

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