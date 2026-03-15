import { img } from '../types/size';
/**
 *
 * @returns image size variant
 */
export function DecideImageSize(): img {
  let width: number = window.innerWidth;
  let height: number = window.innerHeight;

  if (width < 2560 && height < 1440) {
    return 'fullhd';
  } else if (width >= 2560 && height >= 1440 && width <= 3840 && height <= 2160) {
    return 'wqhd';
  } else {
    return 'uhd';
  }
}
