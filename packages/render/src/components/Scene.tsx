import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Importer } from "./importer";
import { OrbitLogger } from "./orbitLogger";

import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useRenderSelector } from "../store/hooks";

function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const modelData = useRenderSelector(
    (state) => state.render.controls.modelData
  );

  useEffect(() => {
    if (modelData && controlsRef.current) {
      // This is not the camera it is the OrbitControl object
      const camera = controlsRef.current.object;

      if (!Array.isArray(modelData.scale)) return;

      const [x, y, z] = modelData.scale;
      const maxDimension = Math.max(Number(x), Number(y), Number(z));
      camera.position.z *= maxDimension;
    }
  }, [modelData]);

  return (
    <div className="h-[500px] w-[500px] relative border">
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <Importer />
        <OrbitControls ref={controlsRef} enableDamping={false} makeDefault />
        <OrbitLogger controlsRef={controlsRef} />
      </Canvas>
    </div>
  );
}

export default Scene;
