import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import {
  OrthographicCamera,
  PerspectiveCamera,
  WebGPURenderer,
} from "three/webgpu";

export enum ECameraType {
  ORTHO,
  PERSP,
}

interface CameraConfig {
  camera: PerspectiveCamera | OrthographicCamera;
  zPos: number;
  defaultZoom?: number;
  defaultFrustum?: number;
}

function configureCamera({
  camera,
  zPos,
  defaultZoom = 1,
  defaultFrustum = 1,
}: CameraConfig) {
  if (camera instanceof PerspectiveCamera) {
    camera.position.set(0, 0, zPos);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  } else if (camera instanceof OrthographicCamera) {
    const viewSize = defaultFrustum * 3; // Change to zoom out-in
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
 * @param file
 * @param modelData
 * @param perspectiveCamRef
 * @param orthoCam
 * @param cameraMode
 */
export function repositionCameras(file, modelData, perspectiveCamRef, orthoCam, cameraMode: ECameraType) {
  if (!file || !modelData || !Array.isArray(modelData.scale)) return;

  const [x, y, z] = modelData.scale;
  const maxDimension = Math.max(Number(x), Number(y), Number(z));

  //TODO: Magic Number
  const zPos = 7 * maxDimension;

  //TODO: one render call for this, check why the frustum is not updating
  configureCamera({
    camera: cameraMode == ECameraType.PERSP? perspectiveCamRef : orthoCam,
    zPos,
    defaultFrustum: cameraMode == ECameraType.PERSP? 1 : maxDimension,
  });
}

/**
 * Reset the camera to a default position and zoom level.
 * @param file
 * @param perspectiveCamRef
 * @param orthoCam
 * @param cameraMode
 */
export function resetCameras(file, perspectiveCamRef, orthoCam, cameraMode: ECameraType) {
  if (file !== null) return;
  const defaultZ = 7; // Change to zoom out-in also change it in Scene.tsx

  configureCamera({
    camera: cameraMode == ECameraType.PERSP? perspectiveCamRef : orthoCam,
    zPos: defaultZ,
  })
}

export function CameraSwitcher({ cameraType, perspectiveRef, orthoRef }) {
  const { set } = useThree();

  useEffect(() => {
    const perspectiveCam = perspectiveRef.current;
    const orthoCam = orthoRef.current;

    if (!perspectiveCam || !orthoCam) return;

    const activeCamera =
      cameraType === ECameraType.PERSP ? perspectiveCam : orthoCam;

    set({ camera: activeCamera });
    activeCamera.updateProjectionMatrix();
  }, [cameraType, perspectiveRef, orthoRef, set]);

  return null;
}

export async function initWebGPURenderer(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("webgpu");
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
