import { AssetBase } from './asset';
import { AssetFile } from './file';

export interface ModelDetailContext {
  asset: DetailAsset;
}

// Asset

export interface DetailAsset extends AssetBase {
  files: AssetFile[];
}