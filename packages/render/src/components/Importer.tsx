import { useSelector } from "react-redux";
import { RootState } from "../../../core/src/store/global-store";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useEffect, useRef } from "react";
import { MeshStandardMaterial } from "three";

// Componente reutilizable para el cubo
const WireframeBox = ({
  wireframe,
  onClick,
}: {
  wireframe: boolean;
  onClick: () => void;
}) => {
  return (
    <mesh onClick={onClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="skyblue" wireframe={wireframe} />
    </mesh>
  );
};

export default function Importer() {
  const fileState = useSelector((state: RootState) => state.core.file);
  const [wireframe, setWireframe] = useState(false);
  const modelRef = useRef<any>(null);

  const handleClick = () => {
    setWireframe(!wireframe);
  };

  // Material compartido para el wireframe
  const wireframeMaterial = new MeshStandardMaterial({
    color: "skyblue",
    wireframe: wireframe,
  });

  useEffect(() => {
    // Si hay un modelo cargado, aplicamos el material de wireframe a las mallas
    if (modelRef.current) {
      modelRef.current.traverse((child: any) => {
        if (child.isMesh) {
          child.material = wireframeMaterial;
        }
      });
    }
  }, [wireframe]); // Se actualiza cada vez que cambie el estado de wireframe

  if (!fileState || !fileState.url) {
    // Si no hay archivo cargado, mostrar un cubo con el material de wireframe
    return <WireframeBox wireframe={wireframe} onClick={handleClick} />;
  }

  const fileExtension = fileState.name.split(".").pop()?.toLowerCase();

  if (fileExtension === "gltf") {
    const model = useLoader(GLTFLoader, fileState.url);
    modelRef.current = model.scene; // Referencia al modelo cargado
    return <primitive object={model.scene} scale={10} />;
  } else {
    console.error("Unsupported file type");
    // Si el archivo no es un .gltf, renderizamos un cubo con el material de wireframe
    return <WireframeBox wireframe={wireframe} onClick={handleClick} />;
  }
}
