import InputFile from "./components/FileManager";
import Scene from "./components/Scene";
import RotationDisplay from "./components/RotationDisplay";
import MetadataViewer from "./components/MetadataViewer";
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
