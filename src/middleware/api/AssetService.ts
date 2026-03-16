import { ROUTES } from '../routes';
import { CategoryData } from './CategoryService';
import { Service } from '../Service';
import { TagData } from './TagService';
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
  author: string | null;
  description: string;
  category: CategoryData;
  tags: TagData[];
  created: Date;
  updated: Date;
}

interface RawAssetData extends Omit<AssetData, 'created' | 'updated'> {
  created: string;
  updated: string;
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

export class AssetService extends Service {
  constructor() {
    super(API_PATH);
  }

  private mapAssetDates(asset: RawAssetData): AssetData {
    return {
      ...asset,
      created: new Date(asset.created),
      updated: new Date(asset.updated),
    };
  }

  public async update(data: UpdateModelData): Promise<AssetUpdate> {
    const form = new FormData();

    form.append('name', data.name.substring(0, 128));
    form.append('description', data.description.replace(/\r\n/g, '\n').substring(0, 320));
    form.append('author', data.author ?? '');
    form.append('categoryId', data.category.toString());

    data.tags.forEach((tagId) => {
      form.append('tagIds[]', tagId.toString());
    });

    let metaIndex = 0;
    data.files.forEach((file) => {
      if (file.type === 'local' && file.isRemoved) {
        return;
      }

      form.append(`filesMeta[${metaIndex}][isHidden]`, file.isHidden ? '1' : '0');
      form.append(`filesMeta[${metaIndex}][isMain]`, file.isMain ? '1' : '0');
      form.append(`filesMeta[${metaIndex}][isPreview]`, file.isPreview ? '1' : '0');
      form.append(`filesMeta[${metaIndex}][isRemoved]`, file.isRemoved ? '1' : '0');

      if (file.type === 'fetched') {
        form.append(`filesMeta[${metaIndex}][id]`, file.detailFile.id.toString());
      } else if (file.type === 'local') {
        form.append('files[]', file.localFile);
      }

      metaIndex++;
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
    form.append('description', data.description.replace(/\r\n/g, '\n').substring(0, 320));
    form.append('author', data.author ?? '');
    form.append('categoryId', data.category.toString());

    data.tags.forEach((tagId) => {
      form.append('tagIds[]', tagId.toString());
    });

    data.files.forEach((file, index) => {
      form.append(`filesMeta[${index}][isHidden]`, file.isHidden ? '1' : '0');
      form.append(`filesMeta[${index}][isMain]`, file.isMain ? '1' : '0');
      form.append(`filesMeta[${index}][isPreview]`, file.isPreview ? '1' : '0');
      form.append('files[]', file.localFile);
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
    const response = await this.POST(ROUTES.POST.Asset + id) as { asset: RawAssetData };
    return {
      ...response,
      asset: this.mapAssetDates(response.asset)
    };
  }

  public async getAll(page: number, count: number): Promise<AssetGetAll> {
    const response = await this.POST(ROUTES.POST.Asset + 'all', { page, count }) as { assets: RawAssetData[], info: PaginatedInfo };
    return {
      ...response,
      assets: response.assets.map((a: RawAssetData) => this.mapAssetDates(a))
    };
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

    const response = await this.POST(ROUTES.POST.Asset + 'search', data) as { assets: RawAssetData[], info: PaginatedInfo };
    return {
      ...response,
      assets: response.assets.map((a: RawAssetData) => this.mapAssetDates(a))
    };
  }

  public async getFiles(id: number): Promise<AssetGetFiles> {
    return this.POST(ROUTES.POST.Asset + id + '/files') as Promise<AssetGetFiles>;
  }

  public async delete(id: number): Promise<AssetDelete> {
    return this.POST(ROUTES.POST.Asset + id + '/delete') as Promise<AssetDelete>;
  }
}