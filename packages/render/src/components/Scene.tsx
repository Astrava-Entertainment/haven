import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Importer from "./Importer";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

function Scene() {
  const orbitControlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div className="h-[500px] w-[500px] relative border">
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI / 2}
        />
        <Importer />
        <OrbitControls makeDefault ref={orbitControlsRef} />
      </Canvas>
    </div>
  );
}

export default Scene;
