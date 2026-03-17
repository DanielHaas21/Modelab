import { getFileGroup, SupportedFileTypes } from '../../libs/utils';
import { FILE } from '../ApiClients';
import { DetailFile, LocalManageFile, ManageFile } from '../types';

/**
 * This function creates a DetailFile object from a LocalManageFile object, used when uploading or editing a model.
 * @param localFile The local file to be converted.
 * @param supportedFileTypes The supported file types for conversion.
 * @returns A Promise that resolves to a DetailFile object or null if the conversion fails.
 */
export const createDetailFileFromLocalFile = async (localFile: LocalManageFile, supportedFileTypes: SupportedFileTypes): Promise<DetailFile | null> => {
  const blob = new Blob([localFile.localFile], { type: localFile.type });
  const fileBase = {
    id: -1,
    download: async () => blob,
    previewUrl: 'preview',
    name: localFile.name,
    fileType: localFile.fileType,
  };

  const group = getFileGroup(localFile.fileType, supportedFileTypes);
  switch (group) {
    case 'audio': {
      const audioUrl = URL.createObjectURL(blob);
      return {
        ...fileBase,
        type: 'audio',
        audioUrl: audioUrl,
      };
    }
    case 'image': {
      const imageUrl = URL.createObjectURL(blob);
      return {
        ...fileBase,
        type: 'image',
        imageUrl,
      };
    }
    case 'model': {
      const model = await FILE.loadModelFromLocalFile(localFile.localFile);
      return {
        ...fileBase,
        type: '3d',
        model,
      };
    }
    case 'other': {
      return {
        ...fileBase,
        type: 'other',
      };
    }
  }
  return null;
}

/**
 * This function creates an array of DetailFile objects from an array of ManageFile objects, used when uploading or editing a model.
 * Manage files can be either fetched from the server or local files that the user has uploaded. 
 * The function handles both cases and converts them to DetailFile objects that can be used in the model detail view.
 * @param manageFiles The array of ManageFile objects to be converted.
 * @param supportedFileTypes The supported file types for conversion.
 * @returns A Promise that resolves to an array of DetailFile objects.
 */
export const createDetailFiles = async (manageFiles: ManageFile[], supportedFileTypes: SupportedFileTypes): Promise<DetailFile[]> => {
  const files: DetailFile[] = [];
  for (const manageFile of manageFiles) {
    let file: DetailFile | null = null;

    // determine origin
    switch (manageFile.type) {
      case 'fetched':
        file = manageFile.detailFile;
        break;
      case 'local':
        file = await createDetailFileFromLocalFile(manageFile, supportedFileTypes);
        break;
    }

    if (file !== null) files.push(file);
  }
  return files;
}