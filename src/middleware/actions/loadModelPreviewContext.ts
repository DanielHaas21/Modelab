import { CLEARANCE, Clearance } from '../../store/types';
import { ASSET, FILE } from '../services';
import { ModelPreviewContext } from '../types/actions';

export const loadModelPreviewContext = async (id: number, userClearance: Clearance): Promise<ModelPreviewContext> => {
  const fileMetas = (await ASSET.getFiles({ id: id })).files;

  const userCanDownload = userClearance >= CLEARANCE.USER;

  const previewFile = fileMetas
    ?.filter(file => file.isPreview)
    ?.sort((a, b) => {
      return b.order - a.order;
    })[0];

  if (previewFile === undefined) {
    return {
      previewUrl: null,
    };
  }

  if (userCanDownload && previewFile.group === 'image') {
    const blob = await FILE.get({ id: previewFile.id });
    return {
      previewUrl: URL.createObjectURL(blob),
    };
  }

  return {
    previewUrl: FILE.getPreviewUrl({ id: previewFile.id }),
  }
};