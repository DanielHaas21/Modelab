import * as React from 'react';
import { cn } from '../../utils';
import placeholder from '../assets/placeholder.png';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useModelFromFile } from '../../hooks/useModelFromFile';
import { ModelFileProps } from '../../types/ModelFileProps';
import { isFile } from '../../utils';
import { Scene } from 'three';

// Helper component for the canvas model
interface ModelProps {
  file: ModelFileProps;
}

const Model: React.FC<ModelProps> = ({ file, ...props }) => {
  const File = useModelFromFile(file);
  if (!File) return null;

  return <primitive scale={0.01} {...props} object={File}></primitive>;
};

interface ModelDetailImageProps {
  className?: string;
  image: ModelFileProps;
  canvasKey?: number;
  onContextLoss?: (e: Event) => void;
}

export const ModelDetailImage = React.forwardRef<HTMLDivElement, ModelDetailImageProps>(
  ({ className, image, canvasKey, onContextLoss, ...props }, ref) => {
    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    const is3DFile = isFile._3D(image.name);
    const isImageFile = isFile._img(image.name);

    React.useEffect(() => {
      if (isImageFile) {
        setImageUrl(image.bin);
      } else {
        setImageUrl(null);
      }
    }, [image]);

    const SceneConfig: Scene = new Scene();
    SceneConfig.backgroundBlurriness = 1;

    if (is3DFile) {
      return (
        <div
          className={cn(
            'model-viewer h-70 w-90 d-flex align-items-center justify-content-center',
            className
          )}
          ref={ref}
        >
          <Canvas
            scene={SceneConfig}
            key={canvasKey}
            className="h-80 w-90 rounded-4"
            onCreated={({ gl }) => {
              // We prevent dismounting and trigger a rerender
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                onContextLoss && onContextLoss(e);
              });
            }}
          >
            <Model file={image} />
            <OrbitControls />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <ambientLight intensity={0.4} />
            <Environment background preset="sunset" />
          </Canvas>
        </div>
      );
    }

    if (imageUrl) {
      return (
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          className={cn('object-fit-contain rounded-4 w-80 wrapper', className)}
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
        className={cn('object-fit-contain rounded-4 wrapper w-80', className)}
        src={placeholder}
        alt="Unsupported format"
        {...props}
      />
    );
  }
);
