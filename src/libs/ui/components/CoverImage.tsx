import * as React from 'react';
import { cn, loadImage } from '../../utils';

const images = import.meta.glob('../assets/*.png'); // no idea what datatype this is
const image_name: string = 'train_';

const imageMap = {
  fullhd: `${image_name}fullhd.png`,
  wqhd: `${image_name}wqhd.png`,
  uhd: `${image_name}uhd.png`,
} as const;

export type ImageSize = keyof typeof imageMap;

interface CoverImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: ImageSize;
}

/**
 * Displays a cover image of the train based on the specified size variant. It dynamically loads the appropriate image and handles loading errors gracefully. If the image fails to load, it will not render anything.
 */
export const CoverImage = React.forwardRef<HTMLImageElement, CoverImageProps>(
  ({ className, size, ...props }, ref) => {
    const [imageSrc, setImageSrc] = React.useState<string | null>(null);
    const [error, setError] = React.useState<boolean>(false);

    React.useEffect(() => {
      const fetchImage = async () => {
        try {
          if (!size) return; // dont load if size is undefined
          const path = `../assets/${imageMap[size]}`;
          const image = await loadImage(path, images as Record<string, () => Promise<{ default: string }>>);
          setImageSrc(image);
        } catch (err) {
          setError(true);
          console.error('Error loading image:', err);
        }
      };

      fetchImage();
    }, [size]);

    if (!imageSrc || error) return null;

    return (
      <img className={cn(className)} src={imageSrc} ref={ref} {...props} alt="Cover image" />
    );
  }
);