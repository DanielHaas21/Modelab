import { CategoryAllResponse, CategoryCreateData, CategoryCreateQuery, CategoryCreateResponse, CategoryDeleteQuery, CategorySelectQuery, CategorySelectResponse } from '../../types/services/categoryService';
import { getServiceBaseURL } from '../../utils/getBaseURL';
import { AxiosService } from '../AxiosService';

export class CategoryService extends AxiosService {
  constructor() {
    super(getServiceBaseURL('category'));
  }

  public async getAll() {
    return await this.POST<CategoryAllResponse>(`all`);
  }

  public async get(query: CategorySelectQuery) {
    return await this.POST<CategorySelectResponse>(`${query.id}`);
  }

  public async create(query: CategoryCreateQuery) {
    const data: CategoryCreateData = {
      name: query.name,
    };
    return await this.POST<CategoryCreateResponse>(`create`, data);
  }

  public async delete(query: CategoryDeleteQuery) {
    return await this.POST<CategoryCreateResponse>(`${query.id}/delete`);
  }
}