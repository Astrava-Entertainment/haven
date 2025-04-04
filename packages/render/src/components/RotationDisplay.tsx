import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/src/store/globalStore";

export default function RotationDisplay({ className }: any) {
  const rotation = useSelector(
    (state: RootState) => state.render.gizmo.rotation
  );

  // Mostrar mensaje si no hay rotación
  if (!rotation) {
    return <div>No hay rotación disponible.</div>;
  }

  // Mostrar rotación formateada
  return (
    <div className={className}>
      <h3>Rotación de la cámara:</h3>
      <p>X: {rotation.x.toFixed(2)}</p>
      <p>Y: {rotation.y.toFixed(2)}</p>
      <p>Z: {rotation.z.toFixed(2)}</p>
    </div>
  );
}
