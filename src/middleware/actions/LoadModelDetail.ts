import ApiError from '../api/ApiError';
import { ModelData, ModelFileProp } from '../types';
import { ASSET, FILE } from '../ApiClients';
import { getFileGroup } from '../../libs/utils/isFile';
import { CLEARANCE, Clearance } from '../../store/types';

export default async function loadModelDetail(id: number, userClearance: Clearance): Promise<ModelData> {
  const modelMetadata = await ASSET.get(id);
  const fileMetadata = await ASSET.getFiles(id);
  const supportedFileTypes = await FILE.getSupportedFileTypes();

  const userCanDownload = userClearance >= CLEARANCE.USER;

  if (!fileMetadata) throw new ApiError('Failed to load file metadata', 404, 'service');

  const name = modelMetadata.asset.name;
  const desc = modelMetadata.asset.description;
  const category = modelMetadata.asset.category;
  const tags = modelMetadata.asset.tags;

  const files: ModelFileProp[] = [];
  for (const fileInfo of fileMetadata.files) {
    let file: ModelFileProp | null = null;

    const fileBase = {
      id: fileInfo.id,
      name: fileInfo.name,
      fileType: fileInfo.type,
      download: userCanDownload ? (() => FILE.getBlob(fileInfo.id)) : null,
      previewUrl: FILE.getPreviewURL(fileInfo.id),
    };

    const group = getFileGroup(fileInfo.type, supportedFileTypes);
    if (userCanDownload) {
      switch (group) {
        case 'image':
          const imageBlob = await FILE.getBlob(fileInfo.id);
          const imageUrl = URL.createObjectURL(imageBlob);
          file = {
            ...fileBase,
            type: 'image',
            imageUrl,
          };
          break;
        case 'model':
          const model = await FILE.loadModelFromFile(fileInfo.id, fileInfo.type);
          console.log(model);
          file = {
            ...fileBase,
            type: '3d',
            model,
          };
          break;
        case 'audio':
          const audioBlob = await FILE.getBlob(fileInfo.id);
          const audioUrl = URL.createObjectURL(audioBlob);
          file = {
            ...fileBase,
            type: 'audio',
            audioUrl,
          };
          break;
        case 'other':
          file = {
            ...fileBase,
            type: 'other',
          };
          break;
        default:
          console.error('Unsuported file: ' + fileInfo.name + '. Ignoring.');
          break;
      }
    } else {
      switch (group) {
        case 'image':
        case 'model':
        case 'audio':
          file = {
            ...fileBase,
            type: 'preview',
          };
      }
    }

    if (file !== null) files.push(file);
  }

  const data: ModelData = {
    id: id,
    name: name,
    desc: desc,
    category: category,
    tags: tags,
    files: files,
  };

  return data;
}
