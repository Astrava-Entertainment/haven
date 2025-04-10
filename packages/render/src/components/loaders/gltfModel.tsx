import { useLoader } from "@react-three/fiber";
import MetadataExtractor from "../metadataExtractor";
import { GLTFLoader } from "three-stdlib";
import { MutableRefObject } from "react";

export function GLTFModel(
  fileUrl: string,
  modelRef: MutableRefObject<any>,
  handleClick: () => void
) {
  const model = useLoader(GLTFLoader, fileUrl);
  modelRef.current = model.scene;
  return (
    <>
      <MetadataExtractor model={model.scene} />;
      <primitive object={model.scene} scale={10} onClick={handleClick} />;
    </>
  );
}
