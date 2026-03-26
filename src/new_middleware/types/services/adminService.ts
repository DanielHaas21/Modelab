import { PaginatedInfo } from '../../../middleware/api';
import { BaseResponse } from '../axiosService';
import { LogModel, LogQueries, LogRaw, LogStatus } from '../models/log';
import { PaginationQuery } from '../models/pagination';

// Select All Logs

export interface AdminSelectAllLogsQuery {
  pagination: PaginationQuery;
}

export interface AdminSelectAllLogsData {
  page: number;
  count: number;
}

export interface AdminSelectAllLogsResponse extends BaseResponse {
  logs: LogModel[];
  info: PaginatedInfo;
}

export interface RawAdminSelectAllLogsResponse extends Omit<AdminSelectAllLogsResponse, 'logs'> {
  logs: LogRaw[];
}

// Search Logs

export interface AdminSearchLogsQuery {
  pagination: PaginationQuery;
  queries: LogQueries;
}

export interface AdminSearchLogsData {
  page: number;
  count: number;
  statusQuery?: LogStatus[];
  dateStartQuery?: string;
  dateEndQuery?: string;
}

export interface AdminSearchLogsResponse extends BaseResponse {
  logs: LogModel[];
  info: PaginatedInfo;
}

export interface RawAdminSearchLogsResponse extends Omit<AdminSearchLogsResponse, 'logs'> {
  logs: LogRaw[];
}