import * as THREE from "three/webgpu";
import { useRef } from "react";
import { Canvas, extend, ThreeToJSXElements } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Importer from "./Importer";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

declare module "@react-three/fiber" {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as any);

function Scene() {
  const orbitControlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div className="h-[500px] w-[500px] relative border">
      <Canvas
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props as any);
          await renderer.init();
          return renderer;
        }}
      >
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <Importer />
        <OrbitControls makeDefault ref={orbitControlsRef} />
      </Canvas>
    </div>
  );
}

export default Scene;
