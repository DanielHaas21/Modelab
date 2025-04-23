import * as React from 'react';
import { cn } from '../../utils';
import placeholder from '../assets/placeholder.png';
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useModelFromFile } from '../../hooks/useModelFromFile';
import { ModelFileProps } from '../../types/ModelFileProps';
import { isFile } from '../../utils';


// Helper component for the canvas model
interface ModelProps {file:  ModelFileProps}

const Model : React.FC<ModelProps> = (({file}) => {
  const File = useModelFromFile(file);
  return <primitive object={File}></primitive>
})

interface ModelDetailImageProps {
  className?: string;
  image: ModelFileProps;
  canvasKey?: number;
  onContextLoss?: (e: Event) => void; 
}

export const ModelDetailImage = React.forwardRef<HTMLDivElement, ModelDetailImageProps>(
  ({ className, image, canvasKey, onContextLoss, ...props }, ref) => {
    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    const is3DFile = isFile._3D(image);
    const isImageFile = isFile._img(image);

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
            'model-viewer mt-5 h-90 w-90 d-flex align-items-center justify-content-center',
            className
          )}
          ref={ref}
        >
          <Canvas
            key={canvasKey}
            className="h-80 w-90"
            onCreated={({ gl }) => { // We prevent dismounting and trigger a rerender
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                onContextLoss && onContextLoss(e);
              });
            }}
          >
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

    // Fallback for unsupported types
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
