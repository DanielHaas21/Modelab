/**
 * Contains methods for checking file types
 */
export class isFile {
  /**
   * Checks if its a valid non-proprietary 3D file
   * @param file
   * @returns boolean
   */
  public static _3D(file: string): boolean {
    return /\.(fbx|obj|glb)$/i.test(file);
  }

  /**
   * Checks if its a valid image file
   * @param file
   * @returns boolean
   */
  public static _img(file: string): boolean {
    return /\.(png|jpe?g|gif|svg)$/i.test(file);
  }
}
