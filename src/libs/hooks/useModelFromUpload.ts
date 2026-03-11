import { API_PATH } from '../../middleware/apiPath';
import { ROUTES } from '../../middleware/routes';
import { FileOption } from '../ui/components';

/**
 * Returns either a File URL to the API or a created ObjectURl 
 * @param file 
 * @returns {string}
 */
export const useModelFromUpload = (file: FileOption) =>
  file.id ? (API_PATH + ROUTES.GET.File + file.id) : URL.createObjectURL(file.file!);
