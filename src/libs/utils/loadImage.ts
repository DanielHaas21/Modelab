/**
 * Used for dynamically importing images based off the provided path and name
 * @param path
 * @param images - meta.glob images from the ./assets directory
 * @returns PNG file
 * @throws Error if no image is found
 */
export async function loadImage(path: string, images: any) {
  if (images[path]) {
    const module = await images[path]();
    return module.default;
  }
  throw new Error('Image not found');
}
