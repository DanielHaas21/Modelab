import { FileMetaModel } from '../types/models';
import { getModelTypeFromName, loadModelFromBuffer } from '../utils/modelLoader';
import { FILE } from '../services';
import { Group, Object3DEventMap } from 'three';

export const load3DModel = async (fileMeta: FileMetaModel): Promise<Group<Object3DEventMap> | null> => {
  const modelType = getModelTypeFromName(fileMeta.name);
  if (modelType === null) {
    return null;
  }

  const modelBuffer = await FILE.getBuffer({ id: fileMeta.id });

  try {
    return await loadModelFromBuffer(modelBuffer, modelType, fileMeta.name);
  } catch (error) {
    console.error('Model load failed.', fileMeta, error);
    return null;
  }
};