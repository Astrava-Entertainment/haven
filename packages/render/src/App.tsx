import InputFile from "./components/FileManager";
import Scene from "./components/Scene";
import RotationDisplay from "./components/RotationDisplay";
// Render
function App() {
  return (
    <div className="bg-neutral-800 text-white">
      <InputFile />
      <Scene />
      <RotationDisplay />
    </div>
  );
}

export default App;
