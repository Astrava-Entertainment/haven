import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/src/store";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Importer() {
  const fileState = useSelector((state: RootState) => state.render.file);

  if (!fileState || !fileState.url) return null;

  const fileExtension = fileState.name.split(".").pop()?.toLowerCase();
  if (fileExtension === "gltf") {
    const model = useLoader(GLTFLoader, fileState.url);
    return <primitive object={model.scene || model} scale={10} />;
  } else {
    console.error("Unsupported file type");
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    );
  }
}
