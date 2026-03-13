import React, { createContext, use, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { USER } from '../../../middleware/ApiClients';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { UserStateActions } from '../../../store/slices/User';

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
    if (UserData.auth === null) {
      refreshAuth();
    }
  }, []);

  const refreshAuth = async () => {
    const token = UserData.auth?.authToken ?? localStorage.getItem(AUTH_LS_KEY);

    dispatch(UserStateActions.loginStart());

    if (token === null) {
      dispatch(UserStateActions.loginFailure('Invalid or missing token.'));
      return;
    }

    try {
      const { user } = await USER.getInfo(token);
      localStorage.setItem(AUTH_LS_KEY, token);

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
          clearance: user.clearance,
        }
      }));
    } catch (error) {
      dispatch(UserStateActions.loginFailure('Failed to refresh auth.'));
    }
  };

  const loginWithToken = async (googleToken: string) => {
    dispatch(UserStateActions.loginStart());

    try {
      const { token } = await USER.login(googleToken);
      const { user } = await USER.getInfo(token);

      localStorage.setItem(AUTH_LS_KEY, token);

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
          clearance: user.clearance,
        }
      }));
    } catch (error) {
      dispatch(UserStateActions.loginFailure('Failed to login.'));
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
    localStorage.removeItem(AUTH_LS_KEY);
  };

  return (
    <AuthContext.Provider value={{
      googleLogin,
      changeAccount,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}
