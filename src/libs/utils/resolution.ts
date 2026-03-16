import { ImageSize } from '../ui/components';
/**
 *
 * @returns image size variant
 */
export function DecideImageSize(): ImageSize {
  const width: number = window.innerWidth;
  const height: number = window.innerHeight;

  if (width < 2560 && height < 1440) {
    return 'fullhd';
  } else if (width >= 2560 && height >= 1440 && width <= 3840 && height <= 2160) {
    return 'wqhd';
  } else {
    return 'uhd';
  }
}
