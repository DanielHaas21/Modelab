import * as React from 'react';
import { cn } from '../../utils';
import { DetailImage } from '../../types/DetailImage';
import placeholder from '../assets/placeholder.png';


interface ModelDetailImageProps {
  className?: string;
  image: DetailImage;
}

export const ModelDetailImage = React.forwardRef<HTMLDivElement, ModelDetailImageProps>(
    ({ className, image, ...props }, ref) => {
      const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  
      React.useEffect(() => {
        if (image instanceof File) {
          const ext = image.name.split('.').pop()?.toLowerCase();
          const isImage = ['png', 'jpg', 'jpeg', 'gif'].includes(ext || '');
  
          if (isImage) {
            const url = URL.createObjectURL(image);
            setImageUrl(url);
  
            return () => URL.revokeObjectURL(url); // cleanup
          }
        } else if (typeof image === 'string') {
          setImageUrl(image);
        }
      }, [image]);
  
      if (image instanceof File && /\.(fbx|obj)$/i.test(image.name)) {
        return (
          <div className={cn('model-viewer', className)} ref={ref}>
       
          </div>
        );
      }
  
      // If it's an image
      if (imageUrl) {
        return (
          <img
            ref={ref as React.RefObject<HTMLImageElement>}
            className={cn('object-cover rounded-xl', className)}
            src={imageUrl}
            alt="Preview"
            {...props}
          />
        );
      }
  
      // If file type is not supported
      return (
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          className={cn('object-cover rounded-xl', className)}
          src={placeholder}
          alt="Unsupported format"
          {...props}
        />
      );
    }
  );
