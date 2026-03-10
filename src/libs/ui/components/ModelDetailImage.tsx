import * as React from 'react';
import * as Three from 'three';
import { cn } from '../../utils';
import placeholder from '../assets/placeholder.png';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useModelFromFile } from '../../hooks/useModelFromFile';
import { ModelFileProps } from '../../types/ModelFileProps';
import { isFile } from '../../utils';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsSpin, faCameraRotate, faPalette, faWrench } from '@fortawesome/free-solid-svg-icons';

interface ColorPalette {
  meshColor: string | null;
  wireframeColor: string;
}

const palettes: ColorPalette[] = [
  { meshColor: null, wireframeColor: '#00ff00' },
  { meshColor: '#ffffff', wireframeColor: '#000000' },
  { meshColor: '#000000', wireframeColor: '#ffffff' },
] as const;

interface ModelVisualConfig {
  meshColor: string | null;
  showWireframe: boolean;
  wireframeColor: string;
}

// Helper component for the canvas model
interface ModelProps {
  file: ModelFileProps;
  onModelLoaded?: (model: Three.Object3D) => void;
  modelVisualConfig: ModelVisualConfig;
}

const Model: React.FC<ModelProps> = ({ file, onModelLoaded, modelVisualConfig, ...props }) => {
  const loadedModel = useModelFromFile(file);
  const modelRef = React.useRef<THREE.Object3D>(null);

  React.useEffect(() => {
    if (!modelRef.current) return;
    onModelLoaded && onModelLoaded(modelRef.current);
  }, [loadedModel]);

  if (!loadedModel) return null;

  const clonedModel = loadedModel.clone();

  clonedModel.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;

      if (modelVisualConfig.meshColor) {
        mesh.material = new THREE.MeshBasicMaterial({ color: modelVisualConfig.meshColor });
      }

      if (modelVisualConfig.showWireframe) {
        const wireframeGeometry = new THREE.WireframeGeometry(mesh.geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({ color: modelVisualConfig.wireframeColor });
        const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        mesh.add(wireframe);
      }
    }
  });

  if (!clonedModel) return null;

  return <primitive ref={modelRef} scale={0.1} {...props} object={clonedModel}></primitive>;
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

    const modelRef = React.useRef<Three.Object3D | null>(null);
    const orbitControlsRef = React.createRef<any>(); // this is bad, but there is no type for this
    const refocusCameraRef = React.useRef<() => void>(() => { });

    const [actionsOpen, setActionsOpen] = React.useState<boolean>(false);
    const [autoRotate, setAutoRotate] = React.useState<boolean>(false);

    const [showWireframe, setShowWireframe] = React.useState<boolean>(false);
    const [currentPaletteIndex, setCurrentPaletteIndex] = React.useState<number>(0);
    const [modelVisualConfig, setModelVisualConfig] = React.useState<ModelVisualConfig>({
      meshColor: '#ffffff',
      wireframeColor: '#000000',
      showWireframe: true
    });

    const SceneConfig: Three.Scene = new Three.Scene();
    SceneConfig.backgroundBlurriness = 1;

    React.useEffect(() => {
      if (isImageFile) {
        setImageUrl(image.bin);
      } else {
        setImageUrl(null);
      }
    }, [image]);

    React.useEffect(() => {
      const palette = palettes[currentPaletteIndex];

      setModelVisualConfig({
        ...modelVisualConfig,
        showWireframe: showWireframe,
        ...palette
      });
    }, [showWireframe, currentPaletteIndex]);

    const modelLoaded = (model: Three.Object3D) => {
      modelRef.current = model;
      refocusCameraRef.current();
    };

    const handleCameraRefocusButton = () => {
      refocusCameraRef.current();
    }

    const handleAutoRotateButton = () => {
      setAutoRotate(!autoRotate);
    };

    const handleWireframeButton = () => {
      setShowWireframe((show) => !show);
    };

    const handlePaletteChange = () => {
      setCurrentPaletteIndex((i) => (i + 1) % palettes.length);
    }

    const FocusCamera = () => {
      const { camera } = useThree();

      const refocusCamera = () => {
        if (!modelRef.current) return;

        const box = new Three.Box3().setFromObject(modelRef.current);
        const center = new Three.Vector3();
        const size = new Three.Vector3();
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
        }
      };

      refocusCameraRef.current = refocusCamera;
      return null;
    };

    if (is3DFile) {
      return (
        <div className={cn('model-viewer h-100 w-100 position-relative', className)} ref={ref}>
          <Canvas
            scene={SceneConfig}
            key={canvasKey}
            className="h-100 w-90 min-h-500-px"
            onCreated={({ gl }) => {
              // We prevent dismounting and trigger a rerender
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                onContextLoss && onContextLoss(e);
              }, false);
            }}
          >
            <Model
              onModelLoaded={modelLoaded}
              file={image}
              modelVisualConfig={modelVisualConfig}
            />
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
            style={{ right: 45, top: 20, bottom: 0 }}
          >
            <button
              onClick={() => setActionsOpen(!actionsOpen)}
              className={`menu-btn ${actionsOpen ? 'open' : ''}`}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            {actionsOpen && (
              <div
                className="rounded d-flex flex-column fade-in-half"
                style={{ position: 'relative', left: 10 }}
              >
                <button onClick={handleCameraRefocusButton} className='btn'>
                  <FontAwesomeIcon icon={faCameraRotate} />
                </button>
                <button onClick={handleAutoRotateButton} className='btn'>
                  <FontAwesomeIcon className={autoRotate ? 'auto-spin' : ''} icon={faArrowsSpin} />
                </button>
                <button onClick={handleWireframeButton} className='btn'>
                  <FontAwesomeIcon icon={faWrench} />
                </button>
                <button onClick={handlePaletteChange} className='btn'>
                  <FontAwesomeIcon icon={faPalette} />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (imageUrl) {
      return (
        <div className='w-100 h-100'>
          <img
            ref={ref as React.RefObject<HTMLImageElement>}
            className={cn('w-100 h-100 object-fit-scale', className)}
            src={imageUrl}
            alt="Preview"
            {...props}
          />
        </div>
      );
    }

    // Fallback for unsupported types
    return (
      <img
        ref={ref as React.RefObject<HTMLImageElement>}
        className={cn('h-80 w-100', className)}
        src={placeholder}
        alt="Unsupported format"
        {...props}
      />
    );
  }
);
