import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  OrthographicCamera,
  GizmoHelper,
  GizmoViewport,
} from '@react-three/drei';
import { useRenderSelector, useRenderDispatch } from "@haven/render/shared/index.ts";
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  initWebGPURenderer,
  resetCameras,
  repositionCameras,
  CameraSwitcher,
} from '../utils/scene.tsx';
import { recordRotationChange } from '../utils/orbit.tsx';
import { zoomLevel } from '../constants';
import { Importer } from '../components/importer.tsx';
import { AmbientLight } from 'three';

function MeshViewport() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const perspectiveCamRef = useRef(null);
  const orthoCamRef = useRef(null);
  const modelData = useRenderSelector((state) => state.controls.modelData);
  const file = useRenderSelector((state) => state.file.currentFile);
  const dispatch = useRenderDispatch();

  const [cameraType, setCameraType] = useState<ECameraPerspectiveMode>('perspective');

  const toggleCamera = () => {
    setCameraType((prev) =>
      prev === 'perspective' ? 'orthographic' : 'perspective',
    );
  };

  useEffect(() => {
    repositionCameras(
      file,
      modelData,
      perspectiveCamRef.current,
      orthoCamRef.current,
      cameraType,
    );
  }, [modelData, cameraType]);

  useEffect(() => {
    resetCameras(
      file,
      perspectiveCamRef.current,
      orthoCamRef.current,
      cameraType,
    );
  }, [file, cameraType]);

  return (
    <div className="h-full border">
      <button onClick={toggleCamera} className="absolute z-10 m-2 p-1 bg-white rounded text-black">
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
        {/* Currently working on WebGL */}
        <GizmoHelper alignment="top-right" margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper>

        {/* CAMERAS */}
        <PerspectiveCamera
          ref={perspectiveCamRef}
          position={[0, 0, zoomLevel]}
        />

        <OrthographicCamera ref={orthoCamRef} position={[0, 0, zoomLevel]} />

        <CameraSwitcher
          cameraType={cameraType}
          perspectiveRef={perspectiveCamRef}
          orthoRef={orthoCamRef}
        />

        <AmbientLight intensity={Math.PI / 2} />
        <Importer />
        <OrbitControls
          ref={controlsRef}
          enableDamping={false}
          makeDefault
          onChange={() => {
            recordRotationChange(controlsRef, dispatch);
          }}
        />
      </Canvas>
    </div>
  );
}

export default MeshViewport;
