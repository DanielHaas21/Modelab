import * as React from 'react';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../../../store/slices/User';
import { USER } from '../../../middleware/ApiClients';

interface UserLoginButtonWrapperProps {
  children: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
}

export const UserLoginButtonWrapper: React.FC<UserLoginButtonWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();

  const handleSuccess = async (tokenResponse: TokenResponse) => {
    try {
      const login = await USER.login(tokenResponse.access_token);
      const { user: userData } = await USER.getInfo(login.token);

      dispatch(loginSuccess({
        firstMame: userData.givenName,
        lastName: userData.familyName,
        email: userData.email,
        picture: userData.picture,
        username: `${userData.givenName} ${userData.familyName}`,
        token: login.token,
        clearance: userData.clearance,
      }));
    } catch (error) {
      dispatch(loginFailure('Failed to fetch user info.'));
    }
  };

  const handleError = () => {
    dispatch(loginFailure('Failed.'));
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (children.props.onClick) {
      children.props.onClick(e);
    }
    dispatch(loginStart());
    googleLogin();
  };

  return React.cloneElement(children, {
    onClick: handleLogin,
  });
};