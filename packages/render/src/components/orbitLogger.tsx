import { useFrame } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import React from "react";

interface OrbitLoggerProps {
  controlsRef: React.RefObject<OrbitControlsImpl>;
}

export function OrbitLogger({ controlsRef }: OrbitLoggerProps) {
  //Executes every draw call 0.016ms
  useFrame(() => {
    //Game loop, leave it for future use
  });

  return null;
}
