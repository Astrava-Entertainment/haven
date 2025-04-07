import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Importer } from "./importer";
import { OrbitLogger } from "./orbitLogger";

import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useRenderSelector } from "../store/hooks";
import { useCoreSelector } from "../../../core/src/store/hooks";

function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const modelData = useRenderSelector((state) => state.controls.modelData);
  const file = useCoreSelector((state) => state.core.render.file);
  const prevFileRef = useRef(file);

  // Allow us to relocate the camara on model change
  useEffect(() => {
    const fileChanged = prevFileRef.current?.name !== file?.name;
    if (!fileChanged) return;

    prevFileRef.current = file;

    console.log("modelData:", modelData);
    console.log("controlsRef.current:", controlsRef.current);

    if (!modelData || !controlsRef.current) return;

    if (!Array.isArray(modelData.scale)) return;

    const camera = controlsRef.current.object;
    const [x, y, z] = modelData.scale;
    const maxDimension = Math.max(Number(x), Number(y), Number(z));
    camera.position.z *= maxDimension;
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
