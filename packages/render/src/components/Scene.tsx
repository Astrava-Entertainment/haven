import React, { useRef} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useDispatch } from "react-redux";
import { setRotation } from "../store/slices/gizmoSlice.ts";
import Importer from "./importer";
import {HavenVector3} from "../common";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface OrbitLoggerProps {
  controlsRef: React.RefObject<OrbitControlsImpl>;
}

function OrbitLogger({ controlsRef }: OrbitLoggerProps) {
  const dispatch = useDispatch();

  useFrame(() => {
    if (!controlsRef.current) return;

    const currRotation = controlsRef.current.object.rotation;
    dispatch(setRotation(HavenVector3.fromArray([
          Number(currRotation.x.toFixed(2)),
          Number(currRotation.y.toFixed(2)),
          Number(currRotation.z.toFixed(2)),
        ]))
    );
  });

  return null;
}

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
      {/* <Viewport position={[0, 10, 5]} size={["150px", "150px"]} /> */}
    </div>
  );
}

export default Scene;
