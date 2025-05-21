import "@astrava/design-system/dist/style.css";
// @ts-ignore
import RenderApp from "../../render/src/index";
// @ts-ignore
import ExplorerApp from "../../file-system/src/index";
// import { useCoreSelector } from "./store/hooks"; // tu custom hook

function App() {
  // const openFiles = useCoreSelector((state) => state.core.render); // adapta si el slice se llama distinto

  return (
    <>
      <ExplorerApp />
    </>
  );
}

export default App;
