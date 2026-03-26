import { CLEARANCE, Clearance } from '../../store/types'
import { AssetFile, ModelDetailContext } from '../types/actions';
import { ASSET, FILE } from '../services';
import { FileGroup, getFileGroup } from '../../libs/utils';
import { load3DModel } from './loadModel';
import { FileInfoData } from '../../middleware/api';
import { getModelTypeFromName } from '../utils/modelLoader';

const canShowPreview = (fileInfo: FileInfoData, group: FileGroup) => {
  if (group === 'model' && getModelTypeFromName(fileInfo.name) !== null)
    return false;
  return true;
};

export const loadModelDetailContext = async (id: number, userClearance: Clearance): Promise<ModelDetailContext> => {
  const asset = (await ASSET.get({ id: id })).asset;
  const fileMetas = (await ASSET.getFiles({ id: id })).files;
  const supportedFileTypes = (await FILE.getSupportedFileTypes()).supportedFileTypes;

  const userCanDownload = userClearance >= CLEARANCE.USER;

  const files: AssetFile[] = [];
  for (const fileMeta of fileMetas) {
    let file: AssetFile | null = null;

    const fileBase = {
      ...fileMeta,
      download: userCanDownload ? (async () => await FILE.get({ id: fileMeta.id })) : null,
      previewUrl: FILE.getPreviewUrl({ id: fileMeta.id }),
    };

    const group = getFileGroup(fileMeta.fileType, supportedFileTypes);
    if (userCanDownload) {
      switch (group) {
        case 'image': {
          try {
            const imageBlob = await FILE.get({ id: fileMeta.id });
            const imageUrl = URL.createObjectURL(imageBlob);

            file = {
              ...fileBase,
              type: 'image',
              imageUrl,
            };
          } catch (error) {
            console.error('Image download failed.', fileMeta, error);
          }
          break;
        }
        case 'model': {
          const model = await load3DModel(fileMeta);

          if (model === null)
            break; // skip

          file = {
            ...fileBase,
            type: '3d',
            model,
          };
          break;
        }
        case 'audio': {
          try {
            const audioBlob = await FILE.get({ id: fileMeta.id });
            const audioUrl = URL.createObjectURL(audioBlob);

            file = {
              ...fileBase,
              type: 'audio',
              audioUrl,
            };
          } catch (error) {
            console.error('Audio download failed.', fileMeta, error);
          }
          break;
        }
        case 'other': {
          file = {
            ...fileBase,
            type: 'other',
          };
          break;
        }
        default:
          console.error('Unsuported file: ' + fileMeta.name + '.  Ignoring.');
          break;
      }
    } else if (group !== null && canShowPreview(fileMeta, group)) {
      file = {
        ...fileBase,
        type: 'preview',
      }
    }

    if (file !== null) files.push(file);
  }

  return {
    asset: {
      id: asset.id,
      author: asset.author,
      name: asset.name,
      description: asset.description,
      category: asset.category,
      tags: asset.tags,
      created: asset.created,
      updated: asset.updated,
      files,
    }
  };
};