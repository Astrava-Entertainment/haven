import { useFrame } from "@react-three/fiber";
import { useDispatch } from "react-redux";
import { setRotation } from "../store/slices/gizmoSlice";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface OrbitLoggerProps {
  controlsRef: React.RefObject<OrbitControlsImpl>;
}

export function OrbitLogger({ controlsRef }: OrbitLoggerProps) {
  const dispatch = useDispatch();

  useFrame(() => {
    if (!controlsRef.current) return;

    const currRotation = controlsRef.current.object.rotation;
    const newRotation = {
      x: Number(currRotation.x.toFixed(2)),
      y: Number(currRotation.y.toFixed(2)),
      z: Number(currRotation.z.toFixed(2)),
    };
    dispatch(setRotation(newRotation));
  });

  return null;
}
