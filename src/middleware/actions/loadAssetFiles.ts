import { getFileGroup } from '../../libs/utils';
import { FILE } from '../services';
import { AssetFile, ManageFile, ManageFileLocal } from '../types/actions';
import { SupportedFileTypesModel } from '../types/models';
import { getModelTypeFromName, loadModelFromFile } from '../utils/modelLoader';

const loadAssetFileFromLocalFile = async (localManageFile: ManageFileLocal, supportedFileTypes: SupportedFileTypesModel): Promise<AssetFile | null> => {
  const fileBase = {
    ...localManageFile,
    id: 0,
    download: async () => localManageFile.localFile,
    previewUrl: '',
  };

  const group = getFileGroup(localManageFile.fileType, supportedFileTypes);
  switch (group) {
    case 'image': {
      const imageUrl = URL.createObjectURL(localManageFile.localFile);

      return {
        ...fileBase,
        type: 'image',
        imageUrl,
      };
    }
    case 'model': {
      const modelType = getModelTypeFromName(localManageFile.name);

      if (modelType === null) {
        return null; // Unknown model type
      }

      const model = await loadModelFromFile(localManageFile.localFile, modelType);

      return {
        ...fileBase,
        type: '3d',
        model,
      };
    }
    case 'audio': {
      const audioUrl = URL.createObjectURL(localManageFile.localFile);

      return {
        ...fileBase,
        type: 'audio',
        audioUrl,
      };
    }
    case 'other': {
      return {
        ...fileBase,
        type: 'other',
      };
    }
    default:
      console.error('Unsuported file: ' + localManageFile.name + '.  Ignoring.');
      break;
  }
  return null;
};

export const loadAssetFiles = async (manageFiles: ManageFile[]) => {
  const supportedFileTypes = (await FILE.getSupportedFileTypes()).supportedFileTypes;

  const files: AssetFile[] = [];

  for (const manageFile of manageFiles) {
    let file: AssetFile | null = null;

    switch (manageFile.type) {
      case 'fetched': {
        file = manageFile.fetchedFile;
        break;
      }
      case 'local': {
        file = await loadAssetFileFromLocalFile(manageFile, supportedFileTypes);
        break;
      }
    }

    if (file === null) continue;
    files.push(file);
  }

  return files;
};