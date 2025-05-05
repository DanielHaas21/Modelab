import { FileOption } from '../ui/components';

/**
 * Returns either a File URL to the API or a created ObjectURl 
 * @param file 
 * @returns 
 */
export const useModelFromUpload = (file: FileOption) =>
  file.id ? import.meta.env.VITE_API_PATH + `file/${file.id}` : URL.createObjectURL(file.file!);
