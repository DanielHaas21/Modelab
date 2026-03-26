import { AssetModel, AssetRaw } from '../../types/models/asset';

export const mapAssetRawToModel = (raw: AssetRaw): AssetModel => {
  return {
    ...raw,
    created: new Date(raw.created),
    updated: new Date(raw.updated),
  };
};