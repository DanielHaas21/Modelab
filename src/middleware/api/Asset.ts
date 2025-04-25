import { routes } from '../routes';
import { CategoryData } from './Category';
import Service from './Service';
import { TagData } from './Tag';

interface SearchQuery {
  page: number;
  count: number;
  nameQuery?: string;
  descriptionQuery?: string;
  categoryQuery?: number[];
  tagQuery?: number[];
}

export interface AssetData {
  id: number;
  name: string;
  description: string;
  category: CategoryData;
  tags: TagData[];
}

export interface FileInfoData {
  id: number;
  name: string;
  type: string;
  isHidden: boolean;
}

export interface AssetCreate {
  id: number;
}

export interface AssetGet {
  asset: AssetData;
}

export interface PaginatedInfo {
  page: number;
  count: number;
  pageCount: number;
}

export interface AssetGetAll {
  assets: AssetData[];
  info: PaginatedInfo;
}

export interface AssetSearch {
  assets: AssetData[];
  info: PaginatedInfo;
}

export interface AssetGetFiles {
  files: FileInfoData[];
}

export interface AssetDelete {
  id: number;
}

export class Asset extends Service {
  constructor(baseURL: string) {
    super(baseURL);
  }

  public async create(): Promise<AssetCreate> {
    return this.POST(routes.POST.Asset + 'create') as Promise<AssetCreate>;
  }

  public async get(id: number): Promise<AssetGet> {
    return this.POST(routes.POST.Asset + id) as Promise<AssetGet>;
  }

  public async get_all(page: number, count: number): Promise<AssetGetAll> {
    return this.POST(routes.POST.Asset + 'all', { page, count }) as Promise<AssetGetAll>;
  }

  public async search(query: SearchQuery): Promise<AssetSearch> {
    if (
      query.categoryQuery === undefined &&
      query.tagQuery === undefined &&
      query.descriptionQuery === undefined &&
      query.nameQuery === undefined
    ) {
      console.error('At least one query type must be specified');
      throw new Error('At least one query type must be specified');
    }

    const data = {
      page: query.page,
      count: query.count,
      ...(query.nameQuery !== undefined && { nameQuery: query.nameQuery }),
      ...(query.descriptionQuery !== undefined && { descriptionQuery: query.descriptionQuery }),
      ...(query.categoryQuery !== undefined && { categoryQuery: query.categoryQuery.join(',') }),
      ...(query.tagQuery !== undefined && { tagQuery: query.tagQuery.join(',') }),
    };

    return this.POST(routes.POST.Asset + 'search', data) as Promise<AssetSearch>;
  }

  public async get_files(id: number): Promise<AssetGetFiles> {
    return this.POST(routes.POST.Asset + id + '/files') as Promise<AssetGetFiles>;
  }

  public async delete(id: number): Promise<AssetDelete> {
    return this.POST(routes.POST.Asset + id + '/delete') as Promise<AssetDelete>;
  }
}
