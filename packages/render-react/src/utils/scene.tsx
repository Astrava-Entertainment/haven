import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import {
  OrthographicCamera,
  PerspectiveCamera,
  WebGPURenderer,
} from "three/webgpu";
import { zoomLevel } from "../constants";

// Enums
export enum ECameraType {
  ORTHOGRAPHIC = "orthographic",
  PERSPECTIVE = "perspective",
}

export enum ECameraPerspectiveMode {
  ORTHOGRAPHIC = "orthographic",
  PERSPECTIVE = "perspective",
}

interface CameraConfig {
  camera: PerspectiveCamera | OrthographicCamera;
  zPos: number;
  defaultZoom?: number;
  defaultFrustum?: number;
}

interface IResetCameraProps {
  file: FileData | null;
  perspectiveCamRef: PerspectiveCamera;
  orthographicCam: OrthographicCamera;
  cameraMode: ECameraType;
}

interface IRepositionCameraProps {
  file: FileData | null,
  modelData: ModelData | null,
  perspectiveCamRef: PerspectiveCamera,
  orthographicCam: OrthographicCamera,
  cameraMode: ECameraPerspectiveMode
}

interface FileData {
  url: string;
  name: string;
}

interface ModelData {
  scale: [number, number, number];
}

interface CameraRefs {
  cameraType: ECameraType;
  perspectiveRef: React.RefObject<PerspectiveCamera>;
  orthographicRef: React.RefObject<OrthographicCamera>;
}

/**
 * Configure the camera based on its type and position.
 */
function configureCamera({camera, zPos, defaultZoom = 1, defaultFrustum = 1 }: CameraConfig): void {
  if (camera instanceof PerspectiveCamera) {
    camera.position.set(0, 0, zPos);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  } else if (camera instanceof OrthographicCamera) {
    const viewSize = defaultFrustum * 3;
    camera.left = -viewSize;
    camera.right = viewSize;
    camera.top = viewSize;
    camera.bottom = -viewSize;
    camera.near = -1000;
    camera.far = 1000;
    camera.zoom = defaultZoom;
    camera.position.set(0, 0, zPos);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }
}

/**
 * Reposition the cameras based on the model data.
 */
export function repositionCameras({ file, modelData, perspectiveCamRef, orthographicCam, cameraMode}: IRepositionCameraProps): void {
  if (!file || !modelData || !Array.isArray(modelData.scale)) return;

  const [x, y, z] = modelData.scale;
  const maxDimension = Math.max(Number(x), Number(y), Number(z));
  const zPos = zoomLevel * maxDimension;

  configureCamera({
    camera: cameraMode === ECameraPerspectiveMode.PERSPECTIVE
      ? perspectiveCamRef
      : orthographicCam,
    zPos,
    defaultFrustum: cameraMode === ECameraPerspectiveMode.PERSPECTIVE ? 1 : maxDimension,
  });
}

/**
 * Reset the camera to default zoom/position.
 */
export function resetCameras({ file, perspectiveCamRef, orthographicCam, cameraMode} : IResetCameraProps): void {
  if (file !== null) return;

  configureCamera({
    camera: cameraMode === ECameraType.PERSPECTIVE ? perspectiveCamRef : orthographicCam,
    zPos: zoomLevel,
  });
}

/**
 * Switch active camera inside React Three Fiber context.
 */
export function CameraSwitcher({ cameraType, perspectiveRef, orthographicRef }: CameraRefs): JSX.Element | null {
  const { set } = useThree();

  useEffect(() => {
    const perspectiveCam = perspectiveRef.current;
    const orthographicCam = orthographicRef.current;

    if (!perspectiveCam || !orthographicCam) return;

    const activeCamera = cameraType === ECameraType.PERSPECTIVE ? perspectiveCam : orthographicCam;

    set({ camera: activeCamera });
    activeCamera.updateProjectionMatrix();
  }, [cameraType, perspectiveRef, orthographicRef, set]);

  return null;
}

/**
 * Initialize a WebGPU renderer with fallback.
 */
export async function initWebGPURenderer(
  canvas: HTMLCanvasElement
): Promise<WebGPURenderer | null> {
  const context = canvas.getContext("webgpu") as GPUCanvasContext | null;
  const adapter = await navigator.gpu?.requestAdapter();
  const device = await adapter?.requestDevice();

  if (!context || !device) {
    console.warn("Falling back to WebGL | WebGPU not available.");
    return null;
  }

  const renderer = new WebGPURenderer({ canvas, context, device });
  await renderer.init();
  return renderer;
}
