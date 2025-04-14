import * as React from 'react';
import { cn, loadImage } from '../../utils';
import { cva, VariantProps } from 'class-variance-authority';

const images = import.meta.glob('../assets/*.png'); // no idea what datatype this is
const image_name: string = 'train_';

const CoverImageVariants = cva('ddsds', {
  variants: {
    size: {
      fullhd: image_name + 'fullhd.png',
      wqhd: image_name + 'wqhd.png',
      uhd: image_name + 'uhd.png',
    },
  },
});

type CoverImageVariantProps = VariantProps<typeof CoverImageVariants>;

interface CoverImageProps extends CoverImageVariantProps {
  className?: string;
}

export const CoverImage = React.forwardRef<HTMLImageElement, CoverImageProps>(
  ({ className, size, ...props }, ref) => {
    const [imageSrc, setImageSrc] = React.useState<string | null>(null);
    const [error, setError] = React.useState<boolean>(false);

    React.useEffect(() => {
      const fetchImage = async () => {
        try {
          if (!size) return; // Don't load if size is undefined
          const image = await loadImage(`../assets/train_${size}.png`, images);
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
      <img className={cn(className)} src={imageSrc || ''} ref={ref} {...props} alt="Cover image" />
    );
  }
);
