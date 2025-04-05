import { useRenderSelector } from "../store/hooks";

export default function RotationDisplay({ className }: any) {
  const rotation = useRenderSelector((state) => state.render.gizmo.rotation);

  if (!rotation) {
    return <div>No rotation avaible.</div>;
  }

  return (
    <div className={className}>
      <h3>Camera rotation:</h3>
      <p>X: {rotation.x.toFixed(2)}</p>
      <p>Y: {rotation.y.toFixed(2)}</p>
      <p>Z: {rotation.z.toFixed(2)}</p>
    </div>
  );
}
