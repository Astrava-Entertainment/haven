import "@astrava/design-system/dist/tailwind.css";
// import "@astrava/design-system/css/global.css";
// @ts-ignore
import RenderApp from "../../render/src/index";
// @ts-ignore
import ExplorerApp from "../../file-system/src/index";
// import { useCoreSelector } from "./store/hooks"; // tu custom hook

function App() {
  // const openFiles = useCoreSelector((state) => state.core.render); // adapta si el slice se llama distinto

  return (
    <div className="non-select">
      <ExplorerApp />
    </div>
  );
}

export default App;
