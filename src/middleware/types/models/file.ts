export interface SupportedFileExtensionsModel {
  model: string[];
  audio: string[];
  image: string[];
  other: string[];
}

export type FileGroup = keyof SupportedFileExtensionsModel;

export interface FileMetaModel {
  id: number;
  name: string;
  fileType: string;
  group: FileGroup;
  isHidden: boolean;
  isPreview: boolean;
  order: number;
}
