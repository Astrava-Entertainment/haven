import '@astrava/design-system/dist/tailwind.css'
import '@astrava/design-system/dist/style.css'
import '@astrava/design-system/css/base.css'
import '@astrava/design-system/css/global.css'

import React, { useState, useEffect, useMemo } from "react";
import rawTree from '../../file-system/examples/structure.json'
import { hydrateTree } from "../../file-system/src/utils/toHavenFile.ts";
import { useFileDispatch } from "../../file-system/src/store/hooks.ts";
import { loadJson } from "../../file-system/src/store/slices/crudSlice.ts";
import { TreeViewer } from "../../file-system/src/components/treeViewer.tsx";
import { SearchBar } from "../../file-system/src/components/fileSearcher.tsx";
import { treeSearch } from "../../file-system/src/utils/searcher.ts";
import { FileSorter } from "../../file-system/src/components/fileSorter.tsx";
import { sortTreeByNameAsc, sortTreeByTagAsc } from "../../file-system/src/utils/sorter.ts";
import { HavenFile } from './common/havenFile.ts'
import Renderer from '../../render/src/index.tsx'
import MetadataViewer from "../../render/src/components/metadataViewer.tsx";
import { IHavenDirectory, ISortType } from "../../file-system/src/common/interfaces.ts";
import { FileActions } from "../../file-system/src/components/fileActions.tsx";
import { TreeListView } from "../../file-system/src/components/treeListView.tsx";
import { TreeGridView } from "../../file-system/src/components/treeGridView.tsx";

interface ISorterState {
  sortType: ISortType;
}

const App: React.FC = () => {
  const hydratedTree = rawTree.map(hydrateTree);

  const [selectedFile, setSelectedFile] = useState<HavenFile | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTree, setFilteredTree] = useState(hydratedTree);
  const [sortType, setSortType] = useState<ISortType>(ISortType.None);

  const [currentDirectory, setCurrentDirectory] = useState<HavenFile | IHavenDirectory | null>(null);
  const [currentViewMode, setCurrentViewMode] = useState<boolean>(false);

  const dispatch = useFileDispatch();

  useEffect(() => {
    console.log(currentViewMode);
  }, [currentViewMode]);

  useEffect(() => {
    dispatch(loadJson(rawTree))
  }, []);

  useEffect(() => {
    if (!searchInput) {
      setFilteredTree(hydratedTree);
    } else {
      setFilteredTree(treeSearch(hydratedTree, searchInput));
    }
  }, [searchInput]);

  const sorterTree = useMemo(() => {
    switch (sortType) {
      case ISortType.Name:
        return sortTreeByNameAsc(filteredTree);
      case ISortType.Tag:
        return sortTreeByTagAsc(filteredTree);
      default:
        return filteredTree;
    }
  }, [sortType, filteredTree]);

  const currentTree = useMemo(() => {
    if (currentDirectory) return currentDirectory.children;
    return sorterTree;
  }, [currentDirectory, sorterTree]);


  const handleViewTreeInformation = (node: HavenFile | IHavenDirectory) => {
    if (node.type === "directory") {
      setCurrentDirectory(node);
    } else if (node.type === "file") {
      setSelectedFile(node as HavenFile);
    }
  }

  return (
    <div className="non-select bg-neutral-800 h-screen text-white p-4 space-y-4">
      <SearchBar value={searchInput} onChange={setSearchInput} />
      <div className="flex h-[calc(100%-100px)] gap-4">
        <div className="w-1/3 bg-neutral-700 rounded-xl p-4 flex flex-col space-y-4 overflow-hidden">
          <FileActions currentViewMode={currentViewMode} setCurrentViewMode={setCurrentViewMode} setSelectedFile={setSelectedFile} setCurrentDirectory={setCurrentDirectory} />
          <FileSorter sortType={sortType} onChange={setSortType} />

          <div className="overflow-y-auto flex-1 pr-2">
            <TreeViewer tree={sorterTree} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden">


          {selectedFile ? (
            <>
              <div className="bg-neutral-900 rounded-xl p-4 overflow-auto flex-1">
                <Renderer file={selectedFile} />
              </div>
              <MetadataViewer
                className="bg-neutral-900 rounded-xl p-4 overflow-auto max-h-[200px]"
              />
            </>
          ) : currentViewMode ? (
            <TreeListView
              tree={currentTree}
              onDoubleClick={(node) => { handleViewTreeInformation(node) }}
            />
          ) : (
            <TreeGridView
              tree={currentTree}
              onDoubleClick={(node) => { handleViewTreeInformation(node) }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
