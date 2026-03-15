import { Group, Object3DEventMap } from 'three';
import { FileOption } from '../../libs/ui/components';

export interface ModelData {
  id: number;
  name: string;
  desc?: string;
  category: ModelDataProp;
  tags?: ModelDataProp[];
  files: ModelFileProp[]
}

interface ModelDataProp {
  id: number;
  name: string;
}

export interface CreateModelData {
  name: string;
  desc: string;
  category: number;
  tags: number[];
  files: FileOption[];
}

export interface UpdateModelData {
  id: number;
  name: string;
  desc: string;
  category: number;
  tags: number[];
  files: FileOption[];
}

export type ModelFileProp = ModelImageFileProp | Model3DFileProp | ModelAudioFileProp | ModelOtherFileProp | ModelPreviewFileProp;

interface ModelFilePropBase {
  id: number;
  name: string;
  fileType: string;
  previewUrl: string;
  download: (() => Promise<Blob>) | null;
}

export interface ModelPreviewFileProp extends ModelFilePropBase {
  type: 'preview';
}

export interface ModelImageFileProp extends ModelFilePropBase {
  type: 'image';
  imageUrl: string;
}

export interface Model3DFileProp extends ModelFilePropBase {
  type: '3d';
  model: Group<Object3DEventMap> | null;
}

export interface ModelAudioFileProp extends ModelFilePropBase {
  type: 'audio';
  audioUrl: string;
}

export interface ModelOtherFileProp extends ModelFilePropBase {
  type: 'other';
}
