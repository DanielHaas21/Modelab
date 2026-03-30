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
import { Label } from './Label';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useTranslation } from '../../hooks';
import { AssetFile, AssetFile3D, AssetFileAudio, AssetFileImage, AssetFilePreview } from '../../../middleware/types/actions';


// This file is renders a model using THREE
// It composes of multiple subcomponents for different file types, and a main component that decides which one to render based on the file type. 

// Model preview (can be used for both preview and image types since they are both just images with different urls)

interface ModelPreviewProps {
  file: AssetFilePreview;
}

const ModelPreview = React.forwardRef<HTMLDivElement, ModelPreviewProps>(
  ({ file }, ref) => {
    return (
      <div className="w-full grow flex items-center">
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          className={cn('object-contain')}
          src={file.previewUrl}
          alt="Preview"
        />
      </div>
    );
  }
);

// Image (can be used for both image types since they are both just images with different urls)

interface ModelImageProps {
  file: AssetFileImage;
}

const ModelImage = React.forwardRef<HTMLDivElement, ModelImageProps>(
  ({ file }, ref) => {
    return (
      <div className="h-full grow flex justify-center items-center">
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          className="object-contain w-full h-full"
          src={file.imageUrl}
          alt="Image"
        />
      </div>
    );
  }
);


// Model 3D runs a 3D model file through THREE, it includes controls for auto-rotation, wireframe toggle and color palette cycling. It also handles WebGL context loss by re-rendering the canvas.



// color palette for the model, includes a mesh color and a wireframe color, if meshColor is null it will use the original colors of the model
interface ColorPalette {
  meshColor: string | null;
  wireframeColor: string;
}

const palettes: ColorPalette[] = [
  { meshColor: null, wireframeColor: '#00ff00' },
  { meshColor: '#ffffff', wireframeColor: '#000000' },
  { meshColor: '#000000', wireframeColor: '#ffffff' },
] as const;

// Visual configuration for the model, mostly configured via the dropdown menu in the top right corner of the model, it includes mesh color, wireframe toggle, wireframe color and scale (zoom)
interface ModelVisualConfig {
  meshColor: string | null;
  showWireframe: boolean;
  wireframeColor: string;
  scale: number;
}

type ModelType = Three.Group<Three.Object3DEventMap>;

interface ModelProps {
  model: ModelType;
  modelVisualConfig: ModelVisualConfig;
}

const Model = React.forwardRef<ModelType, ModelProps>(
  ({ model, modelVisualConfig }, ref) => {

    const clonedModel = React.useMemo(() => {
      const clone = model.clone();
      clone.traverse((child) => {
        // if its not a mesh, we dont care about it
        if (!(child as THREE.Mesh).isMesh) {
          return;
        }
        // assign new material to the mesh based on the current visual configuration, if meshColor is null we use the original material, otherwise we use a new MeshBasicMaterial with the specified color. If showWireframe is true we also add a wireframe as a child of the mesh with the specified wireframe color.
        const mesh = child as THREE.Mesh;
        if (modelVisualConfig.meshColor) {
          mesh.material = new THREE.MeshBasicMaterial({ color: modelVisualConfig.meshColor });
        }

        // Add wireframe if enabled
        if (modelVisualConfig.showWireframe) {
          const wireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(mesh.geometry),
            new THREE.LineBasicMaterial({ color: modelVisualConfig.wireframeColor })
          );
          mesh.add(wireframe);
        }
      });
      return clone;
    }, [model, modelVisualConfig]);

    // Clamp the scale to prevent extreme zoom levels that could cause performance issues or make the model invisible. The scale can be adjusted via the dropdown menu in the top right corner of the model.
    const clampedScale = Math.max(0.01, Math.min(modelVisualConfig.scale, 100));

    return <primitive ref={ref} scale={clampedScale} object={clonedModel} />;
  }
);


// FocusCamera is a helper component that focuses the camera on the model when it is loaded and whenever the refocus action is triggered from the dropdown menu. 
// It calculates the bounding box of the model and positions the camera accordingly to fit the entire model in view. It also updates the OrbitControls target to ensure that the controls are centered on the model.

export interface FocusCameraHandle {
  refocus: () => void;
}

interface FocusCameraProps {
  modelRef: React.RefObject<ModelType | null>;
  orbitControlsRef: React.RefObject<OrbitControlsImpl | null>;
}

const FocusCamera = React.forwardRef<FocusCameraHandle, FocusCameraProps>(
  ({ modelRef, orbitControlsRef }, ref) => {
    const { camera, size: canvasSize } = useThree();

    const refocusCamera = React.useCallback(() => {
      if (!modelRef.current) return;

      const persCam = camera as THREE.PerspectiveCamera;
      const fov = persCam.fov || 50;
      const aspect = canvasSize.width / canvasSize.height;

      const box = new Three.Box3().setFromObject(modelRef.current);
      const center = new Three.Vector3();
      const size = new Three.Vector3();
      box.getCenter(center);
      box.getSize(size);

      // The following calculations are based on the formula for the field of view of a perspective camera and the size of the model's bounding box. 
      // It calculates the distance needed to fit the entire model in view based on both the height and width of the bounding box, and then positions the camera at that distance along the z-axis while looking at the center of the model.
      const fovInRad = fov * (Math.PI / 180);
      const distanceToFitHeight = size.y / (2 * Math.tan(fovInRad / 2));
      const hFovInRad = 2 * Math.atan(Math.tan(fovInRad / 2) * aspect);
      const distanceToFitWidth = size.x / (2 * Math.tan(hFovInRad / 2));

      const distance = Math.max(distanceToFitHeight, distanceToFitWidth);

      // Position the camera
      camera.position.set(center.x, center.y, center.z + distance);
      camera.lookAt(center);
      camera.updateProjectionMatrix();

      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.copy(center);
        orbitControlsRef.current.update();
      }
    }, [camera, canvasSize, modelRef, orbitControlsRef]);

    React.useImperativeHandle(ref, () => ({
      refocus: refocusCamera
    }), [refocusCamera]);

    React.useLayoutEffect(() => {
      refocusCamera();
    }, [refocusCamera]);

    return null;
  }
);

// 3D model viewer component, it renders a 3D model using the Model component.

interface Model3DProps {
  file: AssetFile3D;
  canvasKey?: number;
  onContextLoss?: (e: Event) => void; // The onContextLoss prop is a callback function that is triggered when the WebGL context is lost, it allows the parent component to handle the context loss by re-rendering the canvas with a new key, which will create a new WebGL context.
}

const Model3D = React.forwardRef<HTMLDivElement, Model3DProps>(
  ({ file, canvasKey, onContextLoss }, ref) => {
    const orbitControlsRef = React.useRef<OrbitControlsImpl>(null);
    const modelRef = React.useRef<ModelType | null>(null);
    const focusCameraRef = React.useRef<FocusCameraHandle>(null);

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

    // The SceneConfig is memoized to prevent unnecessary re-renders of the entire scene when the model visual configuration changes. 
    // It creates a new THREE.Scene instance with a blurred background, which is used as the scene for the Canvas component.
    // By memoizing it, we ensure that the same scene instance is reused across renders unless the dependencies change (in this case, there are no dependencies, so it will only be created once).
    const SceneConfig = React.useMemo(() => {
      const scene = new Three.Scene();
      scene.backgroundBlurriness = 1;
      return scene;
    }, []);

    React.useEffect(() => {
      const palette = palettes[currentPaletteIndex];
      setModelVisualConfig(prev => ({
        ...prev,
        showWireframe,
        ...palette
      }));
    }, [showWireframe, currentPaletteIndex]);

    const handleRefocus = () => {
      focusCameraRef.current?.refocus();
    };
    const handleToggleAutoRotate = () => setAutoRotate(!autoRotate);
    const handleToggleWireframe = () => setShowWireframe(!showWireframe);
    const handleCyclePalette = () => setCurrentPaletteIndex(i => (i + 1) % palettes.length);

    return (
      <div className="w-full h-full model-viewer relative" ref={ref}>
        {!file.model ? (
          <Label>Model not loaded</Label>
        ) : (
          <>
            <Canvas
              scene={SceneConfig}
              key={canvasKey}
              className="h-full w-90 min-h-[500px]"
              onCreated={({ gl }) => {
                gl.domElement.addEventListener('webglcontextlost', (e) => {
                  e.preventDefault();
                  onContextLoss?.(e);
                }, false);
              }}
            >
              <Model
                ref={modelRef}
                model={file.model}
                modelVisualConfig={modelVisualConfig}
              />
              <OrbitControls
                ref={orbitControlsRef}
                makeDefault
                autoRotate={autoRotate}
                autoRotateSpeed={4}
              />
              <FocusCamera
                ref={focusCameraRef}
                modelRef={modelRef}
                orbitControlsRef={orbitControlsRef}
              />
              <directionalLight position={[5, 5, 5]} intensity={3} />
              <ambientLight intensity={1} />
              <Environment background preset="sunset" />
            </Canvas>

            <div className="absolute flex flex-col" style={{ right: 45, top: 20 }}>
              <button
                onClick={() => setActionsOpen(!actionsOpen)}
                className={`menu-btn ${actionsOpen ? 'open' : ''}`}
              >
                <span></span><span></span><span></span>
              </button>
              {actionsOpen && (
                <div className="rounded flex flex-col fade-in-half">
                  <button onClick={handleRefocus}>
                    <FontAwesomeIcon icon={faCameraRotate} />
                  </button>
                  <button onClick={handleToggleAutoRotate}>
                    <FontAwesomeIcon className={autoRotate ? 'animate-spin' : ''} icon={faArrowsSpin} />
                  </button>
                  <button onClick={handleToggleWireframe}>
                    <FontAwesomeIcon icon={faWrench} />
                  </button>
                  <button onClick={handleCyclePalette}>
                    <FontAwesomeIcon icon={faPalette} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
);

// Audio model viewer component, it renders an audio file using the HTML5 audio element.

interface ModelAudioProps {
  file: AssetFileAudio;
}

const ModelAudio = React.forwardRef<HTMLDivElement, ModelAudioProps>(
  ({ file }, ref) => {
    const t = useTranslation('ui.model_detail');

    return (
      <div
        ref={ref}
        className="w-full grow flex items-center"
      >
        <div className='px-16 flex flex-col justify-center items-start w-full'>
          <Label size={'xs'}>{file.name}</Label>
          <audio
            controls
            src={file.audioUrl}
            className="w-full outline-none"
          >
            {t('unsupported_browser')}
          </audio>
        </div>
      </div>
    );
  }
);

export default ModelAudio;

// Top level component that decides which type of model viewer to render based on the file type, it also handles unsupported file types by rendering a placeholder image.

interface ModelDetailImageProps {
  file: AssetFile;
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