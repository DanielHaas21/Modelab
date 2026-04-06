// export interface SupportedFileTypes {
//   model: string[];
//   audio: string[];
//   image: string[];
//   other: string[];
// }

// export type FileGroup = keyof SupportedFileTypes;

// export const isFile = (fileType: string, targetGroup: FileGroup, supportedFileTypes: SupportedFileTypes): boolean => {
//   return supportedFileTypes[targetGroup].includes(fileType);
// };
// /**
//  * Determines the file group for a given file type based on the supported file types.
//  * @param fileType - The type of the file to be categorized.
//  * @param supportedFileTypes  - An object containing arrays of supported file types categorized by group.
//  * @returns 
//  */
// export const getFileGroup = (fileType: string, supportedFileTypes: SupportedFileTypes): FileGroup | null => {
//   // Iterate through each file group and check if the file type belongs to that group
//   for (const groupName of Object.keys(supportedFileTypes)) {
//     const group = groupName as FileGroup;
//     if (supportedFileTypes[group].includes(fileType))
//       return group;
//   }
//   return null;
// };