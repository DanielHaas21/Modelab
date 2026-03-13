import React, { createContext, use, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { loginFailure, loginStart, loginSuccess } from '../../../store/slices/User';
import { USER } from '../../../middleware/ApiClients';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';

interface Auth {
  googleLogin: () => void;
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

    dispatch(loginStart());

    if (token === null) {
      dispatch(loginFailure('Invalid or missing token.'));
      return;
    }

    try {
      const { user } = await USER.getInfo(token);
      localStorage.setItem(AUTH_LS_KEY, token);

      dispatch(loginSuccess({
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
      dispatch(loginFailure('Failed to refresh auth.'));
    }
  };

  const loginWithToken = async (googleToken: string) => {
    dispatch(loginStart());

    try {
      const { token } = await USER.login(googleToken);
      const { user } = await USER.getInfo(token);

      localStorage.setItem(AUTH_LS_KEY, token);

      dispatch(loginSuccess({
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
      dispatch(loginFailure('Failed to login.'));
    }
  };

  const googleLogin = () => {
    dispatch(loginStart());

    if (import.meta.env.DEV) {
      loginWithToken('dev_token');
      return;
    }

    const login = useGoogleLogin({
      onSuccess: (tokenResponse: TokenResponse) => {
        loginWithToken(tokenResponse.access_token);
      },
      onError: () => {
        dispatch(loginFailure('Google login failed.'));
      },
    });
    login();
  };

  return (
    <AuthContext.Provider value={{
      googleLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
}
