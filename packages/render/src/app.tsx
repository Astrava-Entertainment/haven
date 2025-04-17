import InputFile from "./components/fileManager.tsx";
import Scene from "./components/scene.tsx";
import RotationDisplay from "./components/rotationDisplay.tsx";
import MetadataViewer from "./components/metadataViewer.tsx";

// Render
// TODO: Multiple scene
function App() {
  return (
    <div className="bg-neutral-800 text-white">
      <InputFile />
      <div className="flex flex-row gap-x-2">
        <Scene />
        <MetadataViewer className="bg-black p-2 rounded-xl h-[165px]" />
        <RotationDisplay className="bg-black p-2 rounded-xl h-[165px]" />
      </div>
    </div>
  );
}

export default App;
