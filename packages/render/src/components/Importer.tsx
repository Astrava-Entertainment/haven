import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../core/src/store/global-store";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useEffect, useRef } from "react";
import { setWireframe } from "../features/wireframeReducer";

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
  const dispatch = useDispatch();

  // Corrige el selector para acceder correctamente al estado
  const fileState = useSelector((state: RootState) => state.core.file);
  const wireframeState = useSelector(
    (state: RootState) => state.render.wireframe
  );
  const wireframe = wireframeState.value; // Extrae el booleano correctamente

  const modelRef = useRef<any>(null);

  const handleClick = () => {
    // Alterna el estado correctamente
    dispatch(setWireframe({ value: !wireframe }));
  };

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = wireframe;
        }
      });
    }
  }, [wireframe]); // Se actualiza cuando `wireframe` cambia

  if (!fileState || !fileState.url) {
    return <WireframeBox wireframe={wireframe} onClick={handleClick} />;
  }

  const fileExtension = fileState.name.split(".").pop()?.toLowerCase();

  if (fileExtension === "gltf") {
    const model = useLoader(GLTFLoader, fileState.url);
    modelRef.current = model.scene;
    return <primitive object={model.scene} scale={10} onClick={handleClick} />;
  } else {
    console.error("Unsupported file type");
    return <WireframeBox wireframe={wireframe} onClick={handleClick} />;
  }
}
