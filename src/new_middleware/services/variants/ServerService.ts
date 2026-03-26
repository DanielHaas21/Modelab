import { RawServerHealthResponse, ServerHealthResponse } from '../../types/services/serverService';
import { getServiceBaseURL } from '../../utils/getBaseURL';
import { mapServerHealthRawToModel } from '../../utils/mappers/serverMapper';
import { AxiosService } from '../AxiosService';

export class ServerService extends AxiosService {
  constructor() {
    super(getServiceBaseURL('root'));
  }

  public async getHealth(): Promise<ServerHealthResponse> {
    const raw = await this.POST<RawServerHealthResponse>('health');

    return {
      ...raw,
      health: mapServerHealthRawToModel(raw.health)
    };
  }
}