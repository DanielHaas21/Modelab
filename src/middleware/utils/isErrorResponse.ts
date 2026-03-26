import { ErrorResponse } from '../types/axiosService';

export const isErrorResponse = (data: unknown): data is ErrorResponse => {
  return data !== null
    && typeof data === 'object'
    && 'message' in data
    && 'cause' in data;
}