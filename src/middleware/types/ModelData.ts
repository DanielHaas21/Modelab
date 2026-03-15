import { Group, Object3DEventMap } from 'three';
import { FileOption } from '../../libs/ui/components';
import { SupportedFileTypes } from '../../libs/utils';

export interface ModelTagProp {
  id: number;
  name: string;
}

export interface ModelCategoryProp {
  id: number;
  name: string;
}

interface BaseModel {
  id: number;
  name: string;
  description: string;
  category: ModelTagProp;
  tags: ModelCategoryProp[];
}

// Manage

export interface ManageModel extends BaseModel {
  files: ManageFile[];
}

export interface ManageConfigProps {
  allCategories: ModelCategoryProp[];
  allTags: ModelTagProp[];
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

// Detail

export interface DetailModel extends BaseModel {
  files: DetailFile[];
}

export interface ModelDetailData {
  model: DetailModel;
}

export type DetailFile = DetailFileImage | DetailFile3D | DetailFileAudio | DetailFileOther | DetailFilePreview;

interface BaseDetailFile {
  id: number;
  name: string;
  fileType: string;
  previewUrl: string;
  download: (() => Promise<Blob>) | null;
}

export interface DetailFilePreview extends BaseDetailFile {
  type: 'preview';
}

export interface DetailFileImage extends BaseDetailFile {
  type: 'image';
  imageUrl: string;
}

export interface DetailFile3D extends BaseDetailFile {
  type: '3d';
  model: Group<Object3DEventMap> | null;
}

export interface DetailFileAudio extends BaseDetailFile {
  type: 'audio';
  audioUrl: string;
}

export interface DetailFileOther extends BaseDetailFile {
  type: 'other';
}


// export interface CreateModelData {
//   name: string;
//   desc: string;
//   category: number;
//   tags: number[];
//   files: FileOption[];
// }

// export interface UpdateModelData {
//   id: number;
//   name: string;
//   desc: string;
//   category: number;
//   tags: number[];
//   files: FileOption[];
// }