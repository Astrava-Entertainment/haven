import {useRenderSelector} from '@haven/render/hooks';

// Simple function to debug the model rotation
export default function RotationDisplay({ className }: any) {
  const rotation = useRenderSelector((state) => state.gizmo.rotation);

  if (!rotation) {
    return <div>No rotation available.</div>;
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
