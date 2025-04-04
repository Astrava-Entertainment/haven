import InputFile from "./components/fileManager";
import Scene from "./components/scene";
import RotationDisplay from "./components/rotationDisplay";
import MetadataViewer from "./components/metadataViewer";
// Render
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
