import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import Importer from "./Importer";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    const updateRotation = () => {
      if (controlsRef.current) {
        const rotation = controlsRef.current.object.rotation;
        const rotationVector = new Vector3(rotation.x, rotation.y, rotation.z);
        console.log("Camera Rotation:", rotationVector); // Debugging en consola
      }
    };

    if (controlsRef.current) {
      controlsRef.current.addEventListener("change", updateRotation);
    }

    return () => {
      if (controlsRef.current) {
        controlsRef.current.removeEventListener("change", updateRotation);
      }
    };
  }, []);

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
        <OrbitControls makeDefault ref={controlsRef} />
      </Canvas>
    </div>
  );
}

export default Scene;
