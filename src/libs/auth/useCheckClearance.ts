import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Clearance } from '../../store/types';
import { useCallback } from 'react';

export const useCheckClearance = () => {
  const User = useSelector((state: RootState) => state.User);

  const hasClearance = useCallback((minClearance: Clearance) => {
    return User.auth.clearance >= minClearance;
  }, [User.auth.clearance]);

  return {
    hasClearance
  };
};
