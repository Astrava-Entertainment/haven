import { useLoader } from "@react-three/fiber";
import MetadataExtractor from "../metadataExtractor";
import { GLTFLoader } from "three-stdlib";
import { MutableRefObject } from "react";

interface IGLTFProps {
  fileUrl: string;
  modelRef: MutableRefObject<any>;
  onClick: () => void;
}

// TODO BUG: when a model is loaded after
// another model has been loaded, the onClick stops working.
export const GLTFModel = (props: IGLTFProps) => {
  const { fileUrl, modelRef, onClick } = props;
  const model = useLoader(GLTFLoader, fileUrl);
  modelRef.current = model.scene;
  return (
    <>
      <MetadataExtractor model={model.scene} />;
      <primitive object={model.scene} scale={10} onClick={onClick} />
    </>
  );
};
