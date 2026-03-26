import { AssetBase } from './asset';
import { Category } from './category';
import { Tag } from './tag';
import { AssetFile } from './file';

export interface ModelManageContext {
  config: ManageConfig;
  asset: ManageAsset | null;
  create: ManageCreateAssetAction;
  edit: ManageEditAssetAction;
  delete: ManageDeleteAssetAction;
}

// Config

export interface ManageConfig {
  allCategories: Category[];
  allTags: Tag[];
}

// Assset 

export interface ManageAsset extends AssetBase {
  files: ManageFile[];
}

// Create

export interface ManageCreateAssetParams {
  name: string;
  description: string;
  author: string | null;
  category: Category;
  tags: Tag[];
  files: ManageFileLocal[];
}

export interface ManageCreateAssetResponse {
  createdAssetId: number;
}

export type ManageCreateAssetAction = (params: ManageCreateAssetParams) => Promise<ManageCreateAssetResponse>;

// Update

export interface ManageEditAssetParams {
  id: number;
  name: string;
  description: string;
  author: string | null;
  category: Category;
  tags: Tag[];
  files: ManageFile[];
}

export interface ManageEditAssetResponse {
  editedAssetId: number;
}

export type ManageEditAssetAction = (params: ManageEditAssetParams) => Promise<ManageEditAssetResponse>;

// Delete

export interface ManageDeleteAssetParams {
  id: number;
}

export interface ManageDeleteAssetResponse {
  deletedAssetId: number;
}

export type ManageDeleteAssetAction = (params: ManageDeleteAssetParams) => Promise<ManageDeleteAssetResponse>;

// File

export type ManageFile = ManageFileLocal | ManageFileFetched;

interface BaseManageFile {
  name: string;
  fileType: string;
  isHidden: boolean;
  isMain: boolean;
  isPreview: boolean;
  isRemoved: boolean;
}

export interface ManageFileFetched extends BaseManageFile {
  type: 'fetched';
  fetchedFile: AssetFile;
}

export interface ManageFileLocal extends BaseManageFile {
  type: 'local';
  localFile: File;
}
