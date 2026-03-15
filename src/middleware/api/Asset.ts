import { ROUTES } from '../routes';
import { CategoryData } from './Category';
import { Service } from '../Service';
import { TagData } from './Tag';
import { CreateModelData, UpdateModelData } from '../types';
import FormData from 'form-data';
import { API_PATH } from '../apiPath';
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
  fileType: string;
  isHidden: boolean;
  isMain: boolean;
  isPreview: boolean;
}

export interface AssetUpdate {
  id: number;
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
  constructor() {
    super(API_PATH);
  }

  public async update(data: UpdateModelData): Promise<AssetUpdate> {
    const form = new FormData();

    form.append('name', data.name.substring(0, 128));
    form.append('description', data.desc.substring(0, 320));
    form.append('categoryId', data.category.toString());
    data.tags.forEach((tagId) => {
      form.append('tagIds[]', tagId.toString());
    });

    data.files.forEach((file, index) => {
      form.append('filesMeta[' + index.toString() + '][isHidden]', file.isHidden ? '1' : '0');
      form.append('filesMeta[' + index.toString() + '][isMain]', file.isMain ? '1' : '0');
      form.append('files[]', file.file!);
    });

    return this.POST(ROUTES.POST.Asset + data.id + '/update', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }) as Promise<AssetUpdate>;
  }

  public async create(data: CreateModelData): Promise<AssetCreate> {
    const form = new FormData();

    form.append('name', data.name.substring(0, 128));
    form.append('description', data.desc.substring(0, 320));
    form.append('categoryId', data.category.toString());
    data.tags.forEach((tagId) => {
      form.append('tagIds[]', tagId.toString());
    });

    data.files.forEach((file, index) => {
      form.append('filesMeta[' + index.toString() + '][isHidden]', file.isHidden ? '1' : '0');
      form.append('filesMeta[' + index.toString() + '][isMain]', file.isMain ? '1' : '0');
      form.append('files[]', file.file!);
    });

    return this.POST(ROUTES.POST.Asset + 'create', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }) as Promise<AssetCreate>;
  }

  public async get(id: number): Promise<AssetGet> {
    return this.POST(ROUTES.POST.Asset + id) as Promise<AssetGet>;
  }

  public async getAll(page: number, count: number): Promise<AssetGetAll> {
    return this.POST(ROUTES.POST.Asset + 'all', { page, count }) as Promise<AssetGetAll>;
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

    return this.POST(ROUTES.POST.Asset + 'search', data) as Promise<AssetSearch>;
  }

  public async getFiles(id: number): Promise<AssetGetFiles> {
    return this.POST(ROUTES.POST.Asset + id + '/files') as Promise<AssetGetFiles>;
  }

  public async delete(id: number): Promise<AssetDelete> {
    return this.POST(ROUTES.POST.Asset + id + '/delete') as Promise<AssetDelete>;
  }
}
