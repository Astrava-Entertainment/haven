import Viewport from "../components/viewport.tsx";
import RotationDisplay from "../components/rotationDisplay.tsx";
import MetadataViewer from "../components/metadataViewer.tsx";

function Viewer3d() {
  return (
    <>
      <h1 className="text-2xl">3D Viewer</h1>
      <div className="flex flex-row gap-x-2 bg-neutral-800">
        <Viewport />
        <MetadataViewer className="bg-black p-2 rounded-xl h-[165px] text-white" />
        <RotationDisplay className="bg-black p-2 rounded-xl h-[165px] text-white" />
      </div>
    </>
  );
}

export default Viewer3d;
