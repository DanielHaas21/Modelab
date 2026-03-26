import { LogModel, LogRaw } from '../../types/models/log';

export const mapLogRawToModel = (raw: LogRaw): LogModel => {
  return {
    ...raw,
    date: new Date(raw.date),
  };
};