import * as React from 'react';
import * as Three from 'three';
import { cn } from '../../utils';
import placeholder from '../assets/placeholder.png';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsSpin, faCameraRotate, faPalette, faWrench } from '@fortawesome/free-solid-svg-icons';
import { Model3DFileProp, ModelAudioFileProp, ModelFileProp, ModelImageFileProp, ModelOtherFileProp, ModelPreviewFileProp } from '../../../middleware/types';

// Preview

interface ModelPreivewProps {
  file: ModelPreviewFileProp;
}

const ModelPreview = React.forwardRef<HTMLDivElement, ModelPreivewProps>(
  ({ file }, ref) => {
    return (
      <div className="w-full grow flex items-center">
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          className={cn('w-100 h-100 object-fit-scale')}
          src={file.previewUrl}
          alt="Preview"
        />
      </div>
    );
  }
);

// Image

interface ModelImageProps {
  file: ModelImageFileProp;
}

const ModelImage = React.forwardRef<HTMLDivElement, ModelImageProps>(
  ({ file }, ref) => {
    return (
      <div className="w-full grow flex items-center">
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          className={cn('w-100 h-100 object-fit-scale')}
          src={file.imageUrl}
          alt="Image"
        />
      </div>
    );
  }
);

// 3D

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
  scale: number;
}

// Helper component for the canvas model
interface ModelProps {
  file: Model3DFileProp;
  modelVisualConfig: ModelVisualConfig;
}

const Model: React.FC<ModelProps> = ({ file, modelVisualConfig, ...props }) => {
  if (file.model === null) return null;

  const clonedModel = file.model.clone();

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

  const clampedScale = Math.max(0.01, Math.min(modelVisualConfig.scale, 100));

  return <primitive scale={clampedScale} {...props} object={clonedModel}></primitive>;
};

interface Model3DProps {
  file: Model3DFileProp;
  canvasKey?: number;
  onContextLoss?: (e: Event) => void;
}

const Model3D = React.forwardRef<HTMLDivElement, Model3DProps>(
  ({ file, canvasKey, onContextLoss }, ref) => {
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
      showWireframe: true,
      scale: 0.1,
    });

    const SceneConfig: Three.Scene = new Three.Scene();
    SceneConfig.backgroundBlurriness = 1;

    React.useEffect(() => {
      const palette = palettes[currentPaletteIndex];

      setModelVisualConfig({
        ...modelVisualConfig,
        showWireframe: showWireframe,
        ...palette
      });
    }, [showWireframe, currentPaletteIndex]);

    React.useEffect(() => {
      refocusCameraRef.current();
    }, []);

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

    return (
      <div className="w-full h-100 model-viewer relative" ref={ref}>
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
            file={file}
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
          className="absolute flex flex-col"
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
              className="rounded flex flex-col fade-in-half"
              style={{ position: 'relative' }}
            >
              <button onClick={handleCameraRefocusButton}>
                <FontAwesomeIcon icon={faCameraRotate} />
              </button>
              <button onClick={handleAutoRotateButton}>
                <FontAwesomeIcon className={autoRotate ? 'auto-spin' : ''} icon={faArrowsSpin} />
              </button>
              <button onClick={handleWireframeButton}>
                <FontAwesomeIcon icon={faWrench} />
              </button>
              <button onClick={handlePaletteChange}>
                <FontAwesomeIcon icon={faPalette} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Audio

interface ModelAudioProps {
  file: ModelAudioFileProp;
}

const ModelAudio = React.forwardRef<HTMLDivElement, ModelAudioProps>(
  ({ file }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full grow flex items-center"
      >
        <audio
          controls
          src={file.audioUrl}
          className="w-full h-10 outline-none"
        >
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }
);

export default ModelAudio;

// --

interface ModelDetailImageProps {
  file: ModelFileProp;
}

export const ModelDetailImage = React.forwardRef<HTMLDivElement, ModelDetailImageProps>(
  ({ file }, ref) => {
    const [canvasKey, setCanvasKey] = React.useState(0); // In the component it watches for context loss and triggers a re-render by changing the key

    const handleContextLoss = React.useCallback((e: Event) => {
      e.preventDefault();
      setCanvasKey((prev) => prev + 1);
    }, []);

    switch (file.type) {
      case 'preview':
        return <ModelPreview file={file} ref={ref} />
      case 'image':
        return <ModelImage file={file} ref={ref} />
      case '3d':
        return <Model3D file={file} ref={ref} canvasKey={canvasKey} onContextLoss={handleContextLoss} />
      case 'audio':
        return <ModelAudio file={file} ref={ref} />
      default:
        return (
          <img
            ref={ref as React.RefObject<HTMLImageElement>}
            className={'w-full h-full'}
            src={placeholder}
            alt="Unsupported format"
          />
        );
    }
  }
);

