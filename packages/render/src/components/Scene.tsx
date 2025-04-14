import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Importer } from "./importer";
import { OrbitLogger } from "./orbitLogger";
import { useRenderSelector } from "../store/hooks";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three/webgpu";
import { useRenderDispatch } from "../store/hooks";
import {
  handleCameraRepositioning,
  initWebGPURenderer,
  resetCameraIfNoFile,
} from "../utils/scene";
import { recordRotationChange } from "../utils/orbit";

function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const modelData = useRenderSelector((state) => state.controls.modelData);
  const file = useRenderSelector((state) => state.file.data);
  const dispatch = useRenderDispatch();

  useEffect(() => {
    handleCameraRepositioning(file, modelData, controlsRef);
  }, [modelData]);

  useEffect(() => {
    resetCameraIfNoFile(file, controlsRef);
  }, [file]);

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
