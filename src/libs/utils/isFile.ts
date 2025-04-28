import { ModelFileProps } from '../types/ModelFileProps';
/**
 * Contains methods for checking file types
 */
export class isFile {
    /**
     * Checks if its a valid non-proprietary 3D file 
     * @param file 
     * @returns boolean
     */
  public static _3D(file: ModelFileProps): boolean {
    console.log(file);
    const name = typeof file === 'string' ? file.split('?')[0]  : file.name;
    console.log(/\.(fbx|obj)$/i.test(name))
    return /\.(fbx|obj)$/i.test(name);
  }

  /**
   * Checks if its a valid image file
   * @param file 
   * @returns boolean
   */
  public static _img(file: ModelFileProps): boolean {
    const name = typeof file === 'string' ? file.split('?')[0]  : file.name;
    console.log(/\.(png|jpe?g|gif)$/i.test(name))
    return /\.(png|jpe?g|gif)$/i.test(name);
  }
}
