import '@astrava/design-system/css/base.css'
import '@astrava/design-system/css/global.css'

import React, { useState, useEffect, useMemo } from "react";
import rawTree from '../../file-system/examples/structure.json'
import { hydrateTree } from "../../file-system/src/utils/toHavenFile.ts";
import Renderer from '../../render/src/index.tsx'
import { FileLoader } from "../../file-system/src/components/fileLoader.tsx";
import { TreeViewer } from "../../file-system/src/components/treeViewer.tsx";
import { SearchBar } from "../../file-system/src/components/fileSearcher.tsx";
import { filterTree } from "../../file-system/src/utils/searcher.ts";
import { FileSorter } from "../../file-system/src/components/fileSorter.tsx";
import { sortTreeByNameAsc } from "../../file-system/src/utils/sorter.ts";
import { HavenFile } from './common/havenFile.ts'

const App: React.FC = () => {
  const hydratedTree = rawTree.map(hydrateTree);

  const [selectedFile, setSelectedFile] = useState<HavenFile | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTree, setFilteredTree] = useState(hydratedTree);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    if (!searchInput) {
      setFilteredTree(hydratedTree);
    } else {
      setFilteredTree(filterTree(hydratedTree, searchInput));
    }
  }, [searchInput]);

  const sorterTree = useMemo(() => {
    return sorted ? sortTreeByNameAsc(filteredTree) : filteredTree;
  }, [sorted, filteredTree]);

  return (
    <div className="non-select bg-neutral-800 h-screen text-white p-4 space-y-4">
      {/* Barra de búsqueda general arriba */}
      <SearchBar value={searchInput} onChange={setSearchInput} />

      <div className="flex h-[calc(100%-100px)] gap-4">
        {/* Columna izquierda */}
        <div className="w-1/3 bg-neutral-700 rounded-xl p-4 flex flex-col space-y-4 overflow-hidden">
          <FileSorter sorted={sorted} onToggle={() => setSorted(s => !s)} />
          <div className="overflow-y-auto flex-1 pr-2">
            <TreeViewer
              tree={sorterTree}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex-1 bg-neutral-900 rounded-xl p-4 overflow-auto">
          {selectedFile ? (
            <Renderer file={selectedFile} />
          ) : (
            <div className="text-neutral-500 italic">Selecciona un archivo para ver su contenido</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
