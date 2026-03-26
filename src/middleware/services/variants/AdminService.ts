import { AdminSearchLogsData, AdminSearchLogsQuery, AdminSearchLogsResponse, AdminSelectAllLogsData, AdminSelectAllLogsQuery, AdminSelectAllLogsResponse, RawAdminSearchLogsResponse, RawAdminSelectAllLogsResponse } from '../../types/services/adminService';
import { getServiceBaseURL } from '../../utils/getBaseURL';
import { mapLogRawToModel } from '../../utils/mappers/adminMapper';
import { AxiosService } from '../AxiosService';

export class AdminService extends AxiosService {
  constructor() {
    super(getServiceBaseURL('admin'));
  }

  public async getAllLogs(query: AdminSelectAllLogsQuery): Promise<AdminSelectAllLogsResponse> {
    const data: AdminSelectAllLogsData = {
      page: query.pagination.page,
      count: query.pagination.count
    };
    const raw = await this.POST<RawAdminSelectAllLogsResponse>(`log/all`, data);

    return {
      ...raw,
      logs: raw.logs.map(mapLogRawToModel)
    };
  }

  public async searchLogs(query: AdminSearchLogsQuery): Promise<AdminSearchLogsResponse> {
    const data: AdminSearchLogsData = {
      page: query.pagination.page,
      count: query.pagination.count,
      statusQuery: query.queries.statusQuery,
      dateStartQuery: query.queries.dateStartQuery?.toISOString(),
      dateEndQuery: query.queries.dateEndQuery?.toISOString(),
    };
    const raw = await this.POST<RawAdminSearchLogsResponse>(`log/search`, data);

    return {
      ...raw,
      logs: raw.logs.map(mapLogRawToModel)
    };
  }

}