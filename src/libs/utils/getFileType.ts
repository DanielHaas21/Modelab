const EXTENSION_TO_TYPE: Record<string, string> = {
  // Models
  'obj': 'model/obj',
  'mtl': 'model/mtl',
  'glb': 'model/gltf-binary',
  'fbx': 'application/octet-stream',
  'gltf': 'model/gltf+json',
  'stl': 'model/stl',
  'ma': 'application/mathematica',
  'mb': 'application/mathematica',
  // Audio
  'ogg': 'audio/ogg',
  'mp3': 'audio/mpeg',
  'wav': 'audio/wav',
  'flac': 'audio/flac',
  // Images
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'svg': 'image/svg+xml',
  'webp': 'image/webp',
  'tiff': 'image/tiff',
  'bmp': 'image/bmp',
  // Other
  'zip': 'application/zip',
  'rar': 'application/x-rar-compressed',
  '7z': 'application/x-7z-compressed',
  'gz': 'application/gzip',
  'tar': 'application/x-tar'
} as const;

export const getFileType = (file: File) => {
  const extension = file.name.split('.').pop();
  if (extension === undefined) return null;
  return getExtensionFileType(extension);
};

export const getExtensionFileType = (extension: string) => {
  const key = extension.toLowerCase().replace(/^\./, '');
  return EXTENSION_TO_TYPE[key] ?? null;
};
