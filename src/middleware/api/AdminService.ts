import { API_PATH } from '../apiPath';
import { ROUTES } from '../routes';
import { Service } from '../Service';

const allLogStatuses = ['error', 'warning', 'info', 'debug'] as const;
export type LogStatus = typeof allLogStatuses[number];
export const ALL_LOG_STATUSES = allLogStatuses as unknown as LogStatus[];

interface SearchQuery {
  page: number;
  count: number;
  statusQuery?: string[];
  dateStartQuery?: Date;
  dateEndQuery?: Date[];
}

export interface LogData {
  id: number;
  status: LogStatus;
  origin: string;
  message: string;
  date: Date;
}

interface RawLogData extends Omit<LogData, 'date'> {
  date: string;
}

export interface AdminPaginatedInfo {
  page: number;
  count: number;
  pageCount: number;
}

export interface LogGetAll {
  assets: LogData[];
  info: AdminPaginatedInfo;
}

export interface LogSearch {
  assets: LogData[];
  info: AdminPaginatedInfo;
}

export class AdminService extends Service {
  constructor() {
    super(API_PATH);
  }

  private mapLogDates(log: RawLogData): LogData {
    return {
      ...log,
      date: new Date(log.date),
    };
  }

  public async getAllLogs(page: number, count: number): Promise<LogGetAll> {
    const response = await this.POST(ROUTES.Admin + 'log/all', { page, count }) as { logs: RawLogData[], info: AdminPaginatedInfo };
    return {
      ...response,
      assets: response.logs.map((log: RawLogData) => this.mapLogDates(log))
    };
  }

  public async searchLogs(query: SearchQuery): Promise<LogSearch> {
    if (
      query.statusQuery === undefined &&
      query.dateEndQuery === undefined &&
      query.dateStartQuery === undefined
    ) {
      console.error('At least one query type must be specified');
      throw new Error('At least one query type must be specified');
    }

    const data = {
      page: query.page,
      count: query.count,
      ...(query.statusQuery !== undefined && { statusQuery: query.statusQuery }),
      ...(query.dateEndQuery !== undefined && { dateEndQuery: query.dateEndQuery }),
      ...(query.dateStartQuery !== undefined && { dateStartQuery: query.dateStartQuery }),
    };

    const response = await this.POST(ROUTES.Asset + 'log/search', data) as { logs: RawLogData[], info: AdminPaginatedInfo };
    return {
      ...response,
      assets: response.logs.map((log: RawLogData) => this.mapLogDates(log))
    };
  }
}
