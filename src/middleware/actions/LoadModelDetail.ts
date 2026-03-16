import ApiError from '../api/ApiError';
import { ModelDetailData, DetailFile, DetailModel } from '../types';
import { ASSET, FILE } from '../ApiClients';
import { FileGroup, getFileGroup } from '../../libs/utils/isFile';
import { CLEARANCE, Clearance } from '../../store/types';
import { FileInfoData } from '../api';

const canShowPreview = (fileInfo: FileInfoData, group: FileGroup) => {
  if (group === 'model' && !FILE.isModelFileLoadable(fileInfo.fileType))
    return false;
  return true;
};

export default async function loadModelDetail(id: number, userClearance: Clearance): Promise<ModelDetailData> {
  const modelMetadata = await ASSET.get(id);
  const fileMetadata = await ASSET.getFiles(id);
  const supportedFileTypes = (await FILE.getSupportedFileTypes()).supportedFileTypes;

  const userCanDownload = userClearance >= CLEARANCE.USER;

  if (!fileMetadata) throw new ApiError('Failed to load file metadata', 404, 'service');

  const files: DetailFile[] = [];
  for (const fileInfo of fileMetadata.files) {
    let file: DetailFile | null = null;

    const fileBase = {
      ...fileInfo,
      download: userCanDownload ? (async () => await FILE.getBlob(fileInfo.id, fileInfo.fileType)) : null,
      previewUrl: FILE.getPreviewURL(fileInfo.id),
    };

    const group = getFileGroup(fileInfo.fileType, supportedFileTypes);
    if (userCanDownload) {
      switch (group) {
        case 'image':
          try {
            const imageBlob = await FILE.getBlob(fileInfo.id, fileInfo.fileType);
            const imageUrl = URL.createObjectURL(imageBlob);
            file = {
              ...fileBase,
              type: 'image',
              imageUrl,
            };
          } catch (error) {
            console.error('Image download failed.', fileInfo, error);
          }
          break;
        case 'model':
          try {
            const model = await FILE.loadModelFromFile(fileInfo.id, fileInfo.fileType);

            file = {
              ...fileBase,
              type: '3d',
              model,
            };
          } catch (error) {
            console.error('Model download/parse failed.', fileInfo, error);
          }
          break;
        case 'audio':
          try {
            const audioBlob = await FILE.getBlob(fileInfo.id, fileInfo.fileType);
            const audioUrl = URL.createObjectURL(audioBlob);

            file = {
              ...fileBase,
              type: 'audio',
              audioUrl,
            };
          } catch (error) {
            console.error('Audio download failed.', fileInfo, error);
          }
          break;
        case 'other':
          file = {
            ...fileBase,
            type: 'other',
          };
          break;
        default:
          console.error('Unsuported file: ' + fileInfo.name + '.  Ignoring.');
          break;
      }
    } else if (group !== null && canShowPreview(fileInfo, group)) {
      file = {
        ...fileBase,
        type: 'preview',
      }
    }

    if (file !== null) files.push(file);
  }

  const model: DetailModel = {
    id: modelMetadata.asset.id,
    author: modelMetadata.asset.author,
    name: modelMetadata.asset.name,
    description: modelMetadata.asset.description,
    category: modelMetadata.asset.category,
    tags: modelMetadata.asset.tags,
    created: modelMetadata.asset.created,
    files,
  };

  return {
    model,
  };
}
