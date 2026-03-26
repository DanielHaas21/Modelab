import { isFile } from '../../libs/utils';
import { CLEARANCE, Clearance } from '../../store/types';
import { ASSET, FILE } from '../services';
import { ModelPreviewContext } from '../types/actions/modelPreview';

export const loadModelPreviewContext = async (id: number, userClearance: Clearance): Promise<ModelPreviewContext> => {
  const fileMetas = (await ASSET.getFiles({ id: id })).files;
  const supportedFileTypes = (await FILE.getSupportedFileTypes()).supportedFileTypes;

  const userCanDownload = userClearance >= CLEARANCE.USER;

  const previewImageModel = fileMetas
    .filter((fileMeta) => {
      return isFile(fileMeta.fileType, 'image', supportedFileTypes);
    })
    .sort((a, b) => {
      if (a.isPreview === b.isPreview) return 0;
      return a.isPreview ? -1 : 1;
    })[0];

  if (previewImageModel === undefined) {
    return {
      previewUrl: null,
    };
  }

  if (userCanDownload) {
    const blob = await FILE.get({ id: previewImageModel.id });
    return {
      previewUrl: URL.createObjectURL(blob),
    };
  }

  return {
    previewUrl: FILE.getPreviewUrl({ id: previewImageModel.id }),
  }
};