import { SupportedFileTypes } from '../../libs/utils';
import { BaseModel, DataProp } from './BaseModel';
import { DetailFile } from './DetailModel';

export interface ManageModel extends BaseModel {
  files: ManageFile[];
}

export interface ManageConfigProps {
  allCategories: DataProp[];
  allTags: DataProp[];
  supportedFileTypes: SupportedFileTypes;
}

export interface ModelManageData {
  config: ManageConfigProps;
  model: ManageModel | null;
}

interface BaseManageFile {
  name: string;
  fileType: string;
  isHidden: boolean;
  isMain: boolean;
  isPreview: boolean;
  isRemoved: boolean;
}

export type ManageFile = FetchedManageFile | LocalManageFile;

export interface FetchedManageFile extends BaseManageFile {
  type: 'fetched';
  detailFile: DetailFile;
}

export interface LocalManageFile extends BaseManageFile {
  type: 'local';
  localFile: File;
}