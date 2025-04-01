import InputFile from "./components/fileManager";
import Scene from "./components/scene";
import RotationDisplay from "./components/rotationDisplay";
import MetadataViewer from "./components/metadataViewer";
// Render
function App() {
  return (
    <div className="bg-neutral-800 text-white">
      <InputFile />
      <Scene />
      <RotationDisplay />
      <MetadataViewer />
    </div>
  );
}

export default App;
