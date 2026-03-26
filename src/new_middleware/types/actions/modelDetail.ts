import { Group, Object3DEventMap } from 'three';
import { AssetBase } from './asset';

export interface ModelDetailData {
  asset: DetailAsset;
}

export interface DetailAsset extends AssetBase {
  files: DetailFile[];
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