import { ServerHealthModel } from '../models';

export interface AdminPanelContext {
  health: ServerHealthModel;
}