import { BaseResponse } from '../axiosService';
import { FileMetaModel } from '../models';
import { AssetModel, AssetQueries, AssetRaw } from '../models/asset';
import { PaginationInfo, PaginationQuery } from '../models/pagination';

// All

export interface AssetAllQuery {
  pagination: PaginationQuery;
}

export interface AssetAllQueryData {
  page: number;
  count: number;
}

export interface AssetAllResponse extends BaseResponse {
  assets: AssetModel[];
  info: PaginationInfo;
}

export interface RawAssetAllResponse extends Omit<AssetAllResponse, 'assets'> {
  assets: AssetRaw[];
}

// Search

export interface AssetSearchQuery {
  pagination: PaginationQuery;
  queries: AssetQueries;
}

export interface AssetSearchQueryData {
  page: number;
  count: number;
  nameQuery?: string;
  descriptionQuery?: string;
  authorQuery?: string;
  categoryQuery?: number[];
  tagQuery?: number[];
}

export interface AssetSearchResponse extends BaseResponse {
  assets: AssetModel[];
  info: PaginationInfo;
}

export interface RawAssetSearchResponse extends Omit<AssetSearchResponse, 'assets'> {
  assets: AssetRaw[];
}

// Select

export interface AssetSelectQuery {
  id: number;
}

export interface AssetSelectResponse extends BaseResponse {
  asset: AssetModel;
}

export interface RawAssetSelectResponse extends Omit<AssetSelectResponse, 'asset'> {
  asset: AssetRaw;
}

// Files

export interface AssetFilesQuery {
  id: number;
}

export interface AssetFilesResponse extends BaseResponse {
  files: FileMetaModel[];
}

// Create

export interface AssetCreateFile {
  isHidden: boolean;
  order: number;
  isPreview: boolean;
  file: File | Blob;
}

export interface AssetCreateQuery {
  name: string;
  description: string;
  author: string | null;
  categoryId: number;
  tagIds: number[];
  files: AssetCreateFile[];
}

export interface AssetCreateResponse extends BaseResponse {
  id: number;
  message: string;
}

// Update

interface AssetUpdateFileBase {
  isHidden: boolean;
  order: number;
  isPreview: boolean;
  isRemoved?: boolean;
}

export interface LocalAssetUpdateFile extends AssetUpdateFileBase {
  type: 'local';
  file: File | Blob;
}

export interface FetchedAssetUpdateFile extends AssetUpdateFileBase {
  type: 'fetched';
  id: number;
}

export type AssetUpdateFile = LocalAssetUpdateFile | FetchedAssetUpdateFile;

export interface AssetUpdateQuery {
  id: number;
  name: string;
  description: string;
  author: string | null;
  categoryId: number;
  tagIds: number[];
  files: AssetUpdateFile[];
}

export interface AssetUpdateResponse extends BaseResponse {
  id: number;
  message: string;
}

// Delete

export interface AssetDeleteQuery {
  id: number;
}

export interface AssetDeleteResponse extends BaseResponse {
  id: number;
  message: string;
}