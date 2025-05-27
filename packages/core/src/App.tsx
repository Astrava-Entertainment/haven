import "@astrava/design-system/dist/tailwind.css";
import "@astrava/design-system/css/global.css";
import RenderApp from "../../render/src/index"; // otro módulo, si lo usas

// import FileExplorer from "../../file-system/src/components/fileExplorerApp";
// import SearchBar from "../../file-system/src/components/searchBar";
// import SearchBar from '../../file-system/src/f'
import { SearchBar, ToolBar, TreeView } from '../../file-system/src/app';

function App() {
  return (
    <div className="non-select bg-neutral-800 h-screen">
      <div className="p-4 space-y-4">

        <SearchBar />
        <TreeView />
        {/* <RenderApp file={undefined} /> */}
      </div>
    </div>
  );
}

export default App;
