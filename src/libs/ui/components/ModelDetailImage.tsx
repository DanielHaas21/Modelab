import * as React from 'react';
import { cn } from '../../utils';
import placeholder from '../assets/placeholder.png';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useModelFromFile } from '../../hooks/useModelFromFile';
import { ModelFileProps } from '../../types/ModelFileProps';
import { isFile } from '../../utils';

// Helper component for the canvas model
interface ModelProps {
  file: ModelFileProps;
}

const Model: React.FC<ModelProps> = ({ file }) => {
  const File = useModelFromFile(file);
  return <primitive object={File}></primitive>;
};

interface ModelDetailImageProps {
  className?: string;
  image: ModelFileProps;
}

export const ModelDetailImage = React.forwardRef<HTMLDivElement, ModelDetailImageProps>(
  ({ className, image, ...props }, ref) => {
    console.log(image);
    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    const is3DFile = isFile._3D(image);
    const isImageFile = isFile._img(image);
    console.log(is3DFile, isImageFile);
    React.useEffect(() => {
      if (image instanceof File && isImageFile) {
        const url = URL.createObjectURL(image);
        setImageUrl(url);
        return () => URL.revokeObjectURL(url);
      } else if (typeof image === 'string' && isImageFile) {
        setImageUrl(image);
      } else {
        setImageUrl(null);
      }
    }, [image]);

    if (is3DFile) {
      return (
        <div
          className={cn(
            'model-viewer h-90 w-90 d-flex align-items-center justify-content-center',
            className
          )}
          ref={ref}
        >
          <Canvas className="h-80 w-90">
            {image instanceof File && <Model file={image} />}
            <OrbitControls />
            <Environment background preset="sunset" />
          </Canvas>
        </div>
      );
    }

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

    // Proprietary/unsupported file type fallback
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
