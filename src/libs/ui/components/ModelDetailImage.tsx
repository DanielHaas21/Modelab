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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsSpin, faBars, faCameraRotate, faRotate } from '@fortawesome/free-solid-svg-icons';

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
    const refocusCameraRef = React.useRef<() => void>(() => {});

    const [actionsOpen, setActionsOpen] = React.useState<boolean>(false);
    const [autoRotate, setAutoRotate] = React.useState<boolean>(false);

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
      refocusCameraRef.current();
    };

    const toggleAutoRotate = () => {
      setAutoRotate(!autoRotate);
    };

    const FocusCamera = () => {
      const { camera } = useThree();

      const refocusCamera = () => {
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
          orbitControlsRef.current.autoRotate = true;
          orbitControlsRef.current.autoRotateSpeed = 0;
        }
      };

      refocusCameraRef.current = refocusCamera;
      return null;
    };

    if (is3DFile) {
      return (
        <div
          className={cn(
            'model-viewer h-70 w-90 d-flex align-items-center justify-content-center position-relative',
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
            <OrbitControls
              ref={(ctrl) => {
                orbitControlsRef.current = ctrl;
                if (orbitControlsRef.current)
                  orbitControlsRef.current.autoRotateSpeed = autoRotate ? 4 : 0;
              }}
            />
            <FocusCamera />
            <directionalLight position={[5, 5, 5]} intensity={3} />
            <ambientLight intensity={1} />
            <Environment background preset="sunset" />
          </Canvas>
          <div
            className="position-absolute d-flex flex-column"
            style={{ right: 0, top: 0, bottom: 0 }}
          >
            <button
              onClick={() => {
                setActionsOpen(!actionsOpen);
              }}
              className="btn"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            {actionsOpen && (
              <div className="rounded d-flex flex-column">
                <button onClick={refocusCameraRef.current} className="btn">
                  <FontAwesomeIcon icon={faCameraRotate} />
                </button>
                <button onClick={toggleAutoRotate} className="btn">
                  <FontAwesomeIcon className={autoRotate ? 'auto-spin' : ''} icon={faArrowsSpin} />
                </button>
              </div>
            )}
          </div>
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
