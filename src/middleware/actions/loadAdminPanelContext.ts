import { SERVER } from '../services';
import { AdminPanelContext } from '../types/actions/adminPanel';

export const loadAdminPanelContext = async (): Promise<AdminPanelContext> => {
  const health = (await SERVER.getHealth()).health;

  return {
    health: health,
  };
};