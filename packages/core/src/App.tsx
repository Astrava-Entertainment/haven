import '@astrava/design-system/css/global.css'
import React, { useState, useEffect, useMemo } from "react";
import rawTree from '../../file-system/examples/structure.json'
import {hydrateTree} from "../../file-system/src/utils/toHavenFile.ts";
import Renderer from '../../render/src/index.tsx'
import { FileLoader } from "../../file-system/src/components/fileLoader.tsx";
import { TreeViewer } from "../../file-system/src/components/treeViewer.tsx";
import { SearchBar } from "../../file-system/src/components/fileSearcher.tsx";
import { filterTree } from "../../file-system/src/utils/searcher.ts";
import { FileSorter } from "../../file-system/src/components/fileSorter.tsx";
import { sortTreeByNameAsc } from "../../file-system/src/utils/sorter.ts";

import {HavenFile} from './common/havenFile.ts'

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
    <div className="non-select space-y-4 bg-neutral-800 h-screen text-white p-4">
      <FileLoader rootDir={rawTree} />
      <SearchBar value={searchInput} onChange={setSearchInput} />
      <FileSorter sorted={sorted} onToggle={() => setSorted(s => !s)} />
      <TreeViewer
        tree={sorterTree}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
      {selectedFile && <Renderer file={selectedFile} />}
    </div>
  );
};

export default App;
