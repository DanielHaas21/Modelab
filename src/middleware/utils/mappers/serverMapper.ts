import { ServerHealthModel, ServerHealthRaw } from '../../types/models/server';

export const mapServerHealthRawToModel = (raw: ServerHealthRaw): ServerHealthModel => {
  return {
    ...raw,
    serverTime: new Date(raw.timestamp),
  };
};