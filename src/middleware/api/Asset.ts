import { routes } from '../routes';
import Service from './Service';

interface searchQuery {
  page: number;
  count: number;
  nameQuery?: string;
  descriptionQuery?: string;
  categoryQuery?: number[];
  tagQuery?: number[];
}

export class Asset extends Service {
  constructor(baseURL: string) {
    super(baseURL);
  }

  public async create(): Promise<Object> {
    return this.POST(routes.POST.Asset + 'create');
  }

  public async get(id: number): Promise<Object> {
    return this.POST(routes.POST.Asset + id);
  }

  public async get_all(): Promise<Object> {
    return this.POST(routes.POST.Asset + 'all');
  }

  public async search(query: searchQuery): Promise<Object> {
    if (
      query.categoryQuery === undefined &&
      query.tagQuery === undefined &&
      query.descriptionQuery === undefined &&
      query.nameQuery === undefined
    ) {
      throw console.error('At least one query type must be specified');
    }

    return this.POST(routes.POST.Asset + 'search', {
      page: query.page,
      count: query.count,
      ...(query.nameQuery !== undefined && { nameQuery: query.nameQuery }),
      ...(query.descriptionQuery !== undefined && { descriptionQuery: query.descriptionQuery }),
      ...(query.categoryQuery !== undefined && { categoryQuery: query.categoryQuery }),
      ...(query.tagQuery !== undefined && { tagQuery: query.tagQuery }),
    });
  }

  public async get_files(id: number): Promise<Object> {
    return this.POST(routes.POST.Asset + id + '/files');
  }

  public async delete(id: number): Promise<Object> {
    return this.POST(routes.POST.Asset + id + '/delete');
  }
}
