import { Group, Object3DEventMap } from 'three';

interface AssetBaseFile {
  id: number;
  name: string;
  fileType: string;
  previewUrl: string;
  isHidden: boolean;
  download: (() => Promise<Blob>) | null;
}

export interface AssetFilePreview extends AssetBaseFile {
  type: 'preview';
}

export interface AssetFileImage extends AssetBaseFile {
  type: 'image';
  imageUrl: string;
}

export interface AssetFile3D extends AssetBaseFile {
  type: '3d';
  model: Group<Object3DEventMap>;
}

export interface AssetFileAudio extends AssetBaseFile {
  type: 'audio';
  audioUrl: string;
}

export interface AssetFileOther extends AssetBaseFile {
  type: 'other';
}

export type AssetFile = AssetFileImage | AssetFile3D | AssetFileAudio | AssetFileOther | AssetFilePreview;
