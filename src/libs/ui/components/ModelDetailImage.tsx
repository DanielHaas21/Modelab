import * as React from 'react';
import { cn } from '../../utils';
import placeholder from '../assets/placeholder.png';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useModelFromFile } from '../../hooks/useModelFromFile';
import { ModelFileProps } from '../../types/ModelFileProps';
import { isFile } from '../../utils';
import { Box3, Euler, Object3D, Scene, Vector3 } from 'three';
import { useThree } from '@react-three/fiber';

// Helper component for the canvas model
interface ModelProps {
  file: ModelFileProps;
  onLoad?: (model: Object3D) => void;
}

const Model: React.FC<ModelProps> = ({ file, onLoad, ...props }) => {
  const File = useModelFromFile(file);
  const ref = React.useRef<Object3D>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    onLoad && onLoad(ref.current);
  }, [File]);

  if (!File) return null;

  return <primitive ref={ref} scale={0.1} {...props} object={File}></primitive>;
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

    const modelRef = React.useRef<Object3D | null>(null);
    const orbitControlsRef = React.createRef<any>(); // this is bad, but there is no type for this

    const SceneConfig: Scene = new Scene();
    SceneConfig.backgroundBlurriness = 1;

    React.useEffect(() => {
      if (isImageFile) {
        setImageUrl(image.bin);
      } else {
        setImageUrl(null);
      }
    }, [image]);

    const modelLoaded = (model: Object3D) => {
      modelRef.current = model;
    };

    const FocusCamera = () => {
      const { camera } = useThree();

      React.useEffect(() => {
        if (!modelRef.current) return;

        const box = new Box3().setFromObject(modelRef.current);
        const center = new Vector3();
        const size = new Vector3();
        box.getCenter(center);
        box.getSize(size);

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = 50 * (Math.PI / 180); // vertical fov in radians
        const distance = maxDim / (2 * Math.tan(fov / 2));

        camera.position.set(center.x, center.y, center.z + distance);
        camera.lookAt(center.x, center.y, center.z);
        camera.updateProjectionMatrix();

        if (orbitControlsRef.current) {
          orbitControlsRef.current.target.copy(center);
          orbitControlsRef.current.update();
        }
      }, []);

      return null;
    };

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
            <Model onLoad={modelLoaded} file={image} />
            <OrbitControls ref={orbitControlsRef} />
            <FocusCamera />
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
