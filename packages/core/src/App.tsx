// import '@haven/design-system/'
// import '@haven/design-system/dist/style.css'
// import structure from "@haven/examples/";
import structure from "@haven/examples/fs/project_a/structure.json";
import React, { useState, useEffect, useMemo } from "react";
// import { hydrateTree } from "../../file-system/src/utils/toHavenFile.ts";
// import { useFileDispatch } from "../../file-system/src/store/hooks.ts";
// import { loadJson } from "../../file-system/src/store/slices/crudSlice.ts";
// import { Searchbar }  from "@astrava/file-system/src/components/searchbar.tsx";
// import { treeSearch } from "../../file-system/src/utils/searcher.ts";
// import {sortTreeByNameAsc, sortTreeByTagAsc} from "../../file-system/src/utils/sorter.ts";
// import { HavenFile } from "shared";
// import {HavenFile} from "@haven/core/";
// import MetadataViewer from "../../render/src/components/metadataViewer.tsx";

// interface ISorterState
// {
//   sortType: ESortType;
// }

const App: React.FC = () => {
  console.log(structure);

  return (<></>);
  // const hydratedTree = structure.map(hydrateTree);
  //
  // const [selectedFile, setSelectedFile] = useState<HavenFile | null>(null);
  // const [searchInput, setSearchInput] = useState("");
  // const [filteredTree, setFilteredTree] = useState(hydratedTree);
  // const [sortType, setSortType] = useState<ISorterState>("None");
  //
  //
  // const dispatch = useFileDispatch();
  //
  // useEffect(() => {
  //   dispatch(loadJson(structure))
  // }, []);
  //
  // useEffect(() => {
  //   if (!searchInput) {
  //     setFilteredTree(hydratedTree);
  //   } else {
  //     setFilteredTree(treeSearch(hydratedTree, searchInput));
  //   }
  // }, [searchInput]);
  //
  // const sorterTree = useMemo(() => {
  //   switch (sortType) {
  //     case "Name":
  //       return sortTreeByNameAsc(filteredTree);
  //     case "Tag":
  //       return sortTreeByTagAsc(filteredTree);
  //     default:
  //       return filteredTree;
  //   }
  // }, [sortType, filteredTree]);
  //
  //
  // return (
  //   <div className="non-select bg-neutral-800 h-screen text-white p-4 space-y-4">
  //     <Searchbar value={searchInput} onChange={setSearchInput} />
  //
  //     <div className="flex h-[calc(100%-100px)] gap-4">
  //       <div className="w-1/3 bg-neutral-700 rounded-xl p-4 flex flex-col space-y-4 overflow-hidden">
  //         <FileSorter
  //           sortType={sortType}
  //           onChange={setSortType}
  //         />
  //
  //         <div className="overflow-y-auto flex-1 pr-2">
  //           <TreeViewer
  //             tree={sorterTree}
  //             selectedFile={selectedFile}
  //             setSelectedFile={setSelectedFile}
  //           />
  //         </div>
  //       </div>
  //
  //       <div className="flex flex-1 flex-col gap-4 overflow-hidden">
  //         <div className="bg-neutral-900 rounded-xl p-4 overflow-auto flex-1">
  //           <Renderer file={selectedFile} />
  //         </div>
  //         <>
  //           <MetadataViewer  className="bg-neutral-900 rounded-xl p-4 overflow-auto max-h-[200px]"/>
  //         </>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default App;
