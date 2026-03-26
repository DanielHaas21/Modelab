
export interface SupportedFileTypesModel {
  model: string[];
  audio: string[];
  image: string[];
  other: string[];
}

export interface FileMetaModel {
  id: number;
  name: string;
  fileType: string;
}

export interface AssetFileMetaModel extends FileMetaModel {
  isHidden: boolean;
  isMain: boolean;
  isPreview: boolean;
}