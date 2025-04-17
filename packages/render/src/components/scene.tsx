import React, { useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  OrthographicCamera,
} from "@react-three/drei";
import { Importer } from "./importer.tsx";
import { OrbitLogger } from "./orbitLogger.tsx";
import { useRenderSelector, useRenderDispatch } from "../store/hooks";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  initWebGPURenderer,
  resetCameras,
  repositionCameras,
  CameraSwitcher,
  ECameraType,
} from "../utils/scene";
import { recordRotationChange } from "../utils/orbit";

function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const perspectiveCamRef = useRef();
  const orthoCamRef = useRef();
  const modelData = useRenderSelector((state) => state.controls.modelData);
  const file = useRenderSelector((state) => state.file.data);
  const dispatch = useRenderDispatch();

  const [cameraType, setCameraType] = useState<ECameraType>(ECameraType.PERSP);

  const toggleCamera = () => {
    setCameraType((prev) =>
      prev === ECameraType.PERSP ? ECameraType.ORTHO : ECameraType.PERSP
    );
  };

  //TODO: add the missing parameter enum
  useEffect(() => {
    repositionCameras(
      file,
      modelData,
      perspectiveCamRef.current,
      orthoCamRef.current
    );
  }, [modelData, cameraType]);

  useEffect(() => {
    resetCameras(file, perspectiveCamRef.current, orthoCamRef.current, cameraType);
  }, [file, cameraType]);

  return (
    <div className="h-[500px] w-[500px] relative border">
      <button
        onClick={toggleCamera}
        className="absolute z-10 m-2 p-1 bg-white rounded text-black"
      >
        Cambiar cámara ({cameraType})
      </button>
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
        <PerspectiveCamera ref={perspectiveCamRef} position={[0, 0, 7]} />
        <OrthographicCamera ref={orthoCamRef} position={[0, 0, 7]} />

        <CameraSwitcher
          cameraType={cameraType}
          perspectiveRef={perspectiveCamRef}
          orthoRef={orthoCamRef}
        />

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
