import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckClearance } from './useCheckClearance';
import { Clearance } from '../../store/types';

/**
 * A hook that checks if the user has the required clearance level to access a certain route. If the user does not have the required clearance, they will be redirected to the specified route.
 * @param minClearance The minimum clearance level required to access the route.
 * @param redirectRoute The route to redirect to if the user does not have the required clearance.
 */
export const useValidatePermission = (minClearance: Clearance, redirectRoute: string) => {
  const navigate = useNavigate();
  const { hasClearance } = useCheckClearance();

  React.useEffect(() => {
    if (!hasClearance(minClearance)) {
      navigate(redirectRoute);
      return;
    }

  }, [hasClearance, redirectRoute, navigate, minClearance]);
};
