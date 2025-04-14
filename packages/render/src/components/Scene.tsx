import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Importer } from "./importer";
import { OrbitLogger } from "./orbitLogger";
import { useRenderSelector } from "../store/hooks";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three/webgpu";
import { setRotation } from "../store/slices/gizmoSlice";
import { useRenderDispatch } from "../store/hooks";
import { HavenVector3 } from "../common";

function recordRotationChange(
  controlsRef: React.MutableRefObject<OrbitControlsImpl>,
  dispatch
) {
  const currRotation = controlsRef.current.object.rotation;
  const newRotation = new HavenVector3(
    Number(currRotation.x.toFixed(2)),
    Number(currRotation.y.toFixed(2)),
    Number(currRotation.z.toFixed(2))
  );
  dispatch(setRotation(newRotation.toJSON()));
}

function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const modelData = useRenderSelector((state) => state.controls.modelData);
  const file = useRenderSelector((state) => state.file.data);
  const prevFileRef = useRef(file);
  const dispatch = useRenderDispatch();

  // Allow us to relocate the camara according to the model
  useEffect(() => {
    if (!file || !modelData || !controlsRef.current) return;

    prevFileRef.current = file;

    if (!Array.isArray(modelData.scale)) return;

    const camera = controlsRef.current.object;
    const [x, y, z] = modelData.scale;
    const maxDimension = Math.max(Number(x), Number(y), Number(z));
    camera.position.z = 5 * maxDimension;

    console.log("Camera repositioned for model:", file.name);
  }, [modelData]);

  // Allow us to reset the camara to origin
  useEffect(() => {
    if (!controlsRef.current) return;

    if (file === null) {
      const camera = controlsRef.current.object;

      // Reset full camera transform
      camera.position.set(0, 0, 5);
      camera.rotation.set(0, 0, 0);
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);

      controlsRef.current.update();

      console.log("Camera hard reset (no file)");
    }
  }, [file]);

  async function initWebGPURenderer(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("webgpu");
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();

    if (!context || !device) {
      console.warn("Falling back to WebGL | WebGPU not available.");
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
        <OrbitControls
          ref={controlsRef}
          enableDamping={false}
          makeDefault
          onChange={() => {
            recordRotationChange(controlsRef, dispatch);
          }}
        />
        <OrbitLogger controlsRef={controlsRef} />
      </Canvas>
    </div>
  );
}

export default Scene;
