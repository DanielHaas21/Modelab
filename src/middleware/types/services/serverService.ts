import { BaseResponse } from '../axiosService';
import { ServerHealthRaw, ServerHealthModel } from '../models/server';

// Health

export interface ServerHealthResponse extends BaseResponse {
  health: ServerHealthModel;
}

export interface RawServerHealthResponse extends Omit<ServerHealthResponse, 'health'> {
  health: ServerHealthRaw;
}
