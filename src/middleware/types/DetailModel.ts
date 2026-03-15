import { Group, Object3DEventMap } from 'three';
import { BaseModel } from './BaseModel';

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