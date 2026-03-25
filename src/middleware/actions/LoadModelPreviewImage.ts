import ApiError from '../api/ApiError';
import { ASSET, FILE } from '../ApiServices';
import { isFile } from '../../libs/utils/isFile';
import { CLEARANCE, Clearance } from '../../store/types';

export default async function LoadModelPreviewImage(id: number, userClearance: Clearance): Promise<string | null> {
  const fileMetadata = await ASSET.getFiles(id);
  const supportedFileTypes = (await FILE.getSupportedFileTypes()).supportedFileTypes;

  const userCanDownload = userClearance >= CLEARANCE.USER;

  if (!fileMetadata) throw new ApiError('Failed to load file metadata', 404, 'service');

  const candidates = fileMetadata.files
    .filter((fileInfo) => {
      return isFile(fileInfo.fileType, 'image', supportedFileTypes);
    })
    .sort((a, b) => {
      if (a.isPreview === b.isPreview) return 0;
      return a.isPreview ? -1 : 1;
    });

  if (candidates.length === 0) return null;
  const fileInfo = candidates[0];

  const imageBlob = userCanDownload
    ? await FILE.getBlob(fileInfo.id, fileInfo.fileType)
    : await FILE.getPreviewBlob(fileInfo.id, fileInfo.fileType);

  const imageUrl = URL.createObjectURL(imageBlob);
  return imageUrl;
}
