import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/src/store/global-store";

const RotationDisplay: React.FC = () => {
  const rotation = useSelector((state: RootState) => state.render.rotation);

  // Mostrar mensaje si no hay rotación
  if (!rotation) {
    return <div>No hay rotación disponible.</div>;
  }

  // Mostrar rotación formateada
  return (
    <div>
      <h3>Rotación de la cámara:</h3>
      <p>X: {rotation.x.toFixed(2)}</p>
      <p>Y: {rotation.y.toFixed(2)}</p>
      <p>Z: {rotation.z.toFixed(2)}</p>
    </div>
  );
};

export default RotationDisplay;
