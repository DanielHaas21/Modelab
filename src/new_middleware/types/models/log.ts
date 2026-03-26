
const allLogStatuses = ['error', 'warning', 'info', 'debug'] as const;
export type LogStatus = typeof allLogStatuses[number];
export const ALL_LOG_STATUSES = allLogStatuses as unknown as LogStatus[];

export interface LogModel {
  id: number;
  status: LogStatus;
  origin: string;
  message: string;
  date: Date;
}

export interface LogRaw extends Omit<LogModel, 'date'> {
  date: string;
}

export interface LogQueries {
  statusQuery?: LogStatus[];
  dateStartQuery?: Date;
  dateEndQuery?: Date;
}