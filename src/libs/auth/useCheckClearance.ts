import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Clearance } from '../../store/types';
import { useCallback } from 'react';

/**
 *  A hook that provides a function to check if the user has a certain clearance level. It retrieves the user's clearance level from the Redux store and compares it to the required clearance level.
 * @returns 
 */
export const useCheckClearance = () => {
  const User = useSelector((state: RootState) => state.User);

  const hasClearance = useCallback((minClearance: Clearance) => {
    return User.auth.clearance >= minClearance;
  }, [User.auth.clearance]);

  return {
    hasClearance
  };
};
