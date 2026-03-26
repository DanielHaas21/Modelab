import { TagAllResponse, TagCreateQuery, TagCreateData, TagCreateResponse, TagSelectQuery, TagSelectResponse, TagDeleteQuery, TagDeleteResponse } from '../../types/services/tagService';
import { getServiceBaseURL } from '../../utils/getBaseURL';
import { AxiosService } from '../AxiosService';

export class TagService extends AxiosService {
  constructor() {
    super(getServiceBaseURL('tag'));
  }

  public async getAll() {
    return await this.POST<TagAllResponse>(`all`);
  }

  public async get(query: TagSelectQuery) {
    return await this.POST<TagSelectResponse>(`${query.id}`);
  }

  public async create(query: TagCreateQuery) {
    const data: TagCreateData = {
      name: query.name,
    };
    return await this.POST<TagCreateResponse>(`create`, data);
  }

  public async delete(query: TagDeleteQuery) {
    return await this.POST<TagDeleteResponse>(`${query.id}/delete`);
  }
}