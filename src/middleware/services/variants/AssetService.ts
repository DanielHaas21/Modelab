import {
  AssetAllQuery,
  AssetAllQueryData,
  AssetAllResponse,
  AssetCreateQuery,
  AssetCreateResponse,
  AssetDeleteQuery,
  AssetDeleteResponse,
  AssetFilesQuery,
  AssetFilesResponse,
  AssetSearchQuery,
  AssetSearchQueryData,
  AssetSearchResponse,
  AssetSelectQuery,
  AssetSelectResponse,
  AssetUpdateQuery,
  AssetUpdateResponse,
  RawAssetAllResponse,
  RawAssetSearchResponse,
  RawAssetSelectResponse
} from '../../types/services/assetService';
import { getServiceBaseURL } from '../../utils/getBaseURL';
import { mapAssetRawToModel } from '../../utils/mappers/assetMapper';
import { AxiosService } from '../AxiosService';
import FormData from 'form-data';

export class AssetService extends AxiosService {
  constructor() {
    super(getServiceBaseURL('asset'));
  }

  public async getAll(query: AssetAllQuery): Promise<AssetAllResponse> {
    const data: AssetAllQueryData = {
      page: query.pagination.page,
      count: query.pagination.count,
    };
    const raw = await this.POST<RawAssetAllResponse>(`all`, data);

    return {
      ...raw,
      assets: raw.assets.map(mapAssetRawToModel)
    };
  }

  public async search(query: AssetSearchQuery): Promise<AssetSearchResponse> {
    const data: AssetSearchQueryData = {
      page: query.pagination.page,
      count: query.pagination.count,
      nameQuery: query.queries.nameQuery,
      descriptionQuery: query.queries.descriptionQuery,
      authorQuery: query.queries.authorQuery,
      categoryQuery: query.queries.categoryQuery?.map((c) => c.id),
      tagQuery: query.queries.tagQuery?.map((t) => t.id),
    };
    const raw = await this.POST<RawAssetSearchResponse>(`search`, data);

    return {
      ...raw,
      assets: raw.assets.map(mapAssetRawToModel)
    };
  }

  public async get(query: AssetSelectQuery): Promise<AssetSelectResponse> {
    const raw = await this.POST<RawAssetSelectResponse>(`${query.id}`);

    return {
      ...raw,
      asset: mapAssetRawToModel(raw.asset)
    };
  }

  public async getFiles(query: AssetFilesQuery) {
    return await this.POST<AssetFilesResponse>(`${query.id}/files`);
  }

  public async create(query: AssetCreateQuery): Promise<AssetCreateResponse> {
    const formData = new FormData();
    formData.append('name', query.name);
    formData.append('description', query.description);
    formData.append('author', query.author ?? '');
    formData.append('categoryId', `${query.categoryId}`);

    query.tagIds.forEach((tagId, index) => {
      formData.append(`tagIds[${index}]`, `${tagId}`);
    });

    let uploadIndex = 0;
    query.files.forEach((fileInfo, index) => {
      formData.append(`filesMeta[${index}][isHidden]`, fileInfo.isHidden ? '1' : '0');
      formData.append(`filesMeta[${index}][isMain]`, fileInfo.isMain ? '1' : '0');
      formData.append(`filesMeta[${index}][isPreview]`, fileInfo.isPreview ? '1' : '0');
      formData.append(`files[${uploadIndex}]`, fileInfo.file);
      uploadIndex++;
    });

    return await this.POST<AssetCreateResponse>('create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
  }

  public async update(query: AssetUpdateQuery): Promise<AssetUpdateResponse> {
    const formData = new FormData();
    formData.append('name', query.name);
    formData.append('description', query.description);
    formData.append('author', query.author);
    formData.append('categoryId', `${query.categoryId}`);

    query.tagIds.forEach((tagId, index) => {
      formData.append(`tagIds[${index}]`, `${tagId}`);
    });

    let uploadIndex = 0;
    query.files.forEach((fileInfo, index) => {
      formData.append(`filesMeta[${index}][isHidden]`, fileInfo.isHidden ? '1' : '0');
      formData.append(`filesMeta[${index}][isMain]`, fileInfo.isMain ? '1' : '0');
      formData.append(`filesMeta[${index}][isPreview]`, fileInfo.isPreview ? '1' : '0');
      formData.append(`filesMeta[${index}][isRemoved]`, fileInfo.isRemoved ? '1' : '0');

      if (fileInfo.type === 'local') {
        formData.append(`files[${uploadIndex}]`, fileInfo.file);
        uploadIndex++;
      }

      if (fileInfo.type === 'fetched') {
        formData.append(`filesMeta[${index}][id]`, `${fileInfo.id}`);
      }
    });

    return await this.POST<AssetUpdateResponse>(`${query.id}/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
  }

  public async delete(query: AssetDeleteQuery) {
    return await this.POST<AssetDeleteResponse>(`${query.id}/delete`);
  }
}