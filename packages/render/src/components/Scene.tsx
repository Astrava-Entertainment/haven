import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Importer from "./importer";
import { OrbitLogger } from "./orbitLogger";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div className="h-[500px] w-[500px] relative border">
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <Importer />
        <OrbitControls makeDefault ref={controlsRef} enableDamping={false} />
        <OrbitLogger controlsRef={controlsRef} />
      </Canvas>
    </div>
  );
}

export default Scene;
