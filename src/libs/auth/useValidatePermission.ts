import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export function useValidatePermission(minClearance: number, redirectRoute: string) {
  const navigate = useNavigate();
  const User = useSelector((state: RootState) => state.User);

  React.useEffect(() => {
    if (!User.isAuthenticated) {
      navigate('/');
      return;
    }

    if (User.user!.clearance < minClearance) {
      navigate(redirectRoute);
      return;
    }
  }, [User, minClearance, redirectRoute, navigate]);
}
