import { DetailFile, ManageConfigProps, ManageFile, ManageModel, ModelManageData } from '../types';
import { ASSET, CATEGORY, FILE, TAG } from '../ApiClients';
import { FileGroup, getFileGroup } from '../../libs/utils/isFile';
import { FileInfoData } from '../api';

const canShowPreview = (fileInfo: FileInfoData, group: FileGroup) => {
  if (group === 'model' && !FILE.isModelFileLoadable(fileInfo.fileType))
    return false;
  return true;
};

export default async function loadModelManage(id: number | null): Promise<ModelManageData> {
  const allCategories = (await CATEGORY.getAll()).categories;
  const allTags = (await TAG.getAll()).tags;
  const supportedFileTypes = (await FILE.getSupportedFileTypes()).supportedFileTypes;

  const config: ManageConfigProps = {
    allCategories,
    allTags,
    supportedFileTypes,
  };

  let model: ManageModel | null = null
  if (id !== null) {
    const modelMetadata = await ASSET.get(id);
    const fileMetadata = await ASSET.getFiles(id);

    const files: ManageFile[] = [];
    for (const fileInfo of fileMetadata.files) {
      let detailFile: DetailFile | null = null;

      const detailFileBase = {
        ...fileInfo,
        download: async () => await FILE.getBlob(fileInfo.id, fileInfo.fileType),
        previewUrl: FILE.getPreviewURL(fileInfo.id),
      };

      const group = getFileGroup(fileInfo.fileType, supportedFileTypes);
      switch (group) {
        case 'image':
          const imageBlob = await FILE.getBlob(fileInfo.id, fileInfo.fileType);
          const imageUrl = URL.createObjectURL(imageBlob);
          detailFile = {
            ...detailFileBase,
            type: 'image',
            imageUrl,
          };
          break;
        case 'model':
          const model = await FILE.loadModelFromFile(fileInfo.id, fileInfo.fileType);
          detailFile = {
            ...detailFileBase,
            type: '3d',
            model,
          };
          break;
        case 'audio':
          try {
            const audioBlob = await FILE.getBlob(fileInfo.id, fileInfo.fileType);
            const audioUrl = URL.createObjectURL(audioBlob);

            detailFile = {
              ...detailFileBase,
              type: 'audio',
              audioUrl,
            };
          } catch (error) {
            console.error('Audio download failed:', error);
            break;
          }
          break;
        case 'other':
          detailFile = {
            ...detailFileBase,
            type: 'other',
          };
          break;
        default:
          console.error('Unsuported file: ' + fileInfo.name + '.  Ignoring.');
          break;
      }

      if (detailFile === null) continue;
      files.push({
        ...fileInfo,
        type: 'fetched',
        detailFile,
      });
    }

    model = {
      id: modelMetadata.asset.id,
      name: modelMetadata.asset.name,
      description: modelMetadata.asset.description,
      category: modelMetadata.asset.category,
      tags: modelMetadata.asset.tags,
      files,
    };
  }

  return {
    config,
    model,
  };
}
