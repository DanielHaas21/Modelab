import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const allModelTypes = ['obj', 'fbx'] as const;

export type ModelType = typeof allModelTypes[number];
export const ALL_MODEL_TYPES = allModelTypes as unknown as ModelType[];

export const LOADABLE_MODEL_EXTENSIONS: Record<ModelType, string> = {
  'fbx': 'fbx',
  'obj': 'obj',
};

const getExtension = (fileName: string): string => {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot !== -1 ? fileName.slice(lastDot + 1).toLowerCase() : '';
}

export const getModelTypeFromName = (fileName: string): ModelType | null => {
  const extension = getExtension(fileName);
  for (const modelType of ALL_MODEL_TYPES) {
    if (extension === LOADABLE_MODEL_EXTENSIONS[modelType])
      return modelType;
  }
  return null;
};

export const loadModelFromBuffer = async (buffer: ArrayBuffer, type: ModelType, fileName: string) => {
  switch (type) {
    case 'obj': {
      const objLoader = new OBJLoader();
      const textData = new TextDecoder().decode(buffer);

      return objLoader.parse(textData);
    }
    case 'fbx': {
      const fbxLoader = new FBXLoader();

      return fbxLoader.parse(buffer, fileName);
    }
  }
};

export const loadModelFromFile = async (file: File, type: ModelType) => {
  const bufferData = await file.arrayBuffer();

  return loadModelFromBuffer(bufferData, type, file.name);
};