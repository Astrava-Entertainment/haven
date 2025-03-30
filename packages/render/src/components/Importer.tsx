import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/src/store/core-store";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Importer() {
  const fileState = useSelector((state: RootState) => state.render.file);

  if (!fileState || !fileState.url) {
    // Si no hay archivo cargado, mostrar un cubo
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    );
  }

  const fileExtension = fileState.name.split(".").pop()?.toLowerCase();

  if (fileExtension === "gltf") {
    const model = useLoader(GLTFLoader, fileState.url);
    return <primitive object={model.scene || model} scale={10} />;
  } else {
    console.error("Unsupported file type");
    // Si el archivo no es un .gltf, también renderizamos un cubo como fallback
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    );
  }
}
