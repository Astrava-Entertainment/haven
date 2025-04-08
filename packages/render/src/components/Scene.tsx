import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Importer } from "./importer";
import { OrbitLogger } from "./orbitLogger";
import { useRenderSelector } from "../store/hooks";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three/webgpu";

function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const modelData = useRenderSelector((state) => state.controls.modelData);
  const file = useRenderSelector((state) => state.file.data);
  const prevFileRef = useRef(file);

  // Allow us to relocate the camara according to the model
  useEffect(() => {
    const fileChanged = prevFileRef.current?.name !== file?.name;
    if (!fileChanged) return;

    prevFileRef.current = file;

    if (!modelData || !controlsRef.current) return;

    if (!Array.isArray(modelData.scale)) return;

    const camera = controlsRef.current.object;
    const [x, y, z] = modelData.scale;
    const maxDimension = Math.max(Number(x), Number(y), Number(z));
    camera.position.z *= maxDimension;
  }, [modelData]);

  async function initWebGPURenderer(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("webgpu");
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();

    console.log(context);

    if (!context || !device) {
      console.warn("Falling back to WebGL – WebGPU not available.");
      return null;
    }

    const renderer = new THREE.WebGPURenderer({ canvas, context, device });
    await renderer.init();
    return renderer;
  }

  return (
    <div className="h-[500px] w-[500px] relative border">
      <Canvas
        onCreated={async (state) => {
          const canvas = state.gl.domElement;

          if (!navigator.gpu) return;

          const webgpuRenderer = await initWebGPURenderer(canvas);
          if (!webgpuRenderer) return;

          state.set({ gl: webgpuRenderer as any });

          const loop = () => {
            state.scene.updateMatrixWorld();
            state.camera.updateMatrixWorld();
            webgpuRenderer.renderAsync(state.scene, state.camera);
            requestAnimationFrame(loop);
          };

          loop();
        }}
      >
        <ambientLight intensity={Math.PI / 2} />
        <Importer />
        <OrbitControls ref={controlsRef} enableDamping={false} makeDefault />
        <OrbitLogger controlsRef={controlsRef} />
      </Canvas>
    </div>
  );
}

export default Scene;
