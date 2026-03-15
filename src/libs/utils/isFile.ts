
export interface SupportedFileTypes {
  model: string[];
  audio: string[];
  image: string[];
  other: string[];
}

export type FileGroup = keyof SupportedFileTypes;

export const isFile = (fileType: string, targetGroup: FileGroup, supportedFileTypes: SupportedFileTypes): boolean => {
  return supportedFileTypes[targetGroup].includes(fileType);
};

export const getFileGroup = (fileType: string, supportedFileTypes: SupportedFileTypes): FileGroup | null => {
  for (const groupName of Object.keys(supportedFileTypes)) {
    const group = groupName as FileGroup;
    if (supportedFileTypes[group].includes(fileType))
      return group;
  }
  return null;
};