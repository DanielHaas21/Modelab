import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckClearance } from './useCheckClearance';
import { Clearance } from '../../store/types';

export const useValidatePermission = (minClearance: Clearance, redirectRoute: string) => {
  const navigate = useNavigate();
  const { hasClearance } = useCheckClearance();

  React.useEffect(() => {
    if (!hasClearance(minClearance)) {
      navigate(redirectRoute);
      return;
    }

  }, [hasClearance, redirectRoute, navigate]);
};
