import { WebGPURenderer } from "three/webgpu";

export function handleCameraRepositioning(file, modelData, controlsRef) {
  if (!file || !modelData || !controlsRef.current) return;

  if (!Array.isArray(modelData.scale)) return;

  const camera = controlsRef.current.object;
  const [x, y, z] = modelData.scale;
  const maxDimension = Math.max(Number(x), Number(y), Number(z));
  camera.position.z = 5 * maxDimension;

  console.log("Camera repositioned for model:", file.name);
}

export function resetCameraIfNoFile(file, controlsRef) {
  if (!controlsRef.current) return;

  if (file === null) {
    const camera = controlsRef.current.object;

    camera.position.set(0, 0, 5);
    camera.rotation.set(0, 0, 0);
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);

    controlsRef.current.update();

    console.log("Camera hard reset (no file)");
  }
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
