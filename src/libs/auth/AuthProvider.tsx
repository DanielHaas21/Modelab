import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { RootState } from '../../store/store';
import { ASSET, CATEGORY, FILE, TAG, USER } from '../../middleware/ApiClients';
import { UserStateActions } from '../../store/slices/User';

interface Auth {
  googleLogin: () => void;
  changeAccount: () => void;
  logout: () => void;
}

const AuthContext = createContext<Auth | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_LS_KEY = 'authToken';

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

  useEffect(() => {
    if (!UserData.auth.isAuthenticated) {
      refreshAuth();
    }
  }, []);

  const setToken = (token: string | null) => {
    if (token === null) {
      USER.setToken(token);
      ASSET.setToken(token);
      FILE.setToken(token);
      TAG.setToken(token);
      CATEGORY.setToken(token);
      localStorage.removeItem(AUTH_LS_KEY);
    } else {
      localStorage.setItem(AUTH_LS_KEY, token);
      USER.setToken(token);
      ASSET.setToken(token);
      FILE.setToken(token);
      TAG.setToken(token);
      CATEGORY.setToken(token);
    }
  };

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

  const googleLogin = () => {
    dispatch(UserStateActions.loginStart());


    if (import.meta.env.DEV) {
      loginWithToken('dev_token');
      return;
    }

    const login = useGoogleLogin({
      onSuccess: (tokenResponse: TokenResponse) => {
        loginWithToken(tokenResponse.access_token);
      },
      onError: () => {
        dispatch(UserStateActions.loginFailure('Google login failed.'));
      },
    });
    login();
  };

  const changeAccount = () => {
    logout();
    googleLogin();
  };

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
