import "@astrava/design-system/dist/style.css";
// @ts-ignore
import RenderApp from "../../render/src/index";
// @ts-ignore
import ExplorerApp from "../../file-system/src/index";
import { useCoreSelector } from "./store/hooks"; // tu custom hook

function App() {
  const openFiles = useCoreSelector((state) => state.core.render); // adapta si el slice se llama distinto

  return (
    <>
      <ExplorerApp />
      <div className="flex gap-x-2 m-2">
        {/* Puedes quitar los botones si ya no se usan */}
        <span className="text-sm text-neutral-500">
          Open files: {openFiles.length}
        </span>
      </div>

      {openFiles.map((file, idx) => (
        <div key={idx} className="m-4 border p-2">
          <RenderApp file={file} />
        </div>
      ))}
    </>
  );
}

export default App;
