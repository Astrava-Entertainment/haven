import "@astrava/design-system/dist/tailwind.css";
import "@astrava/design-system/css/global.css";
import React, { useMemo, useState } from "react";
import { useFileSystemSelector } from "../../file-system/src/store/hooks";
import { ESort } from "../../file-system/src/common";
import { SearchBar, ToolBar, TreeView } from "../../file-system/src/app";
import { HavenFileNode } from "../../file-system/src/utils/directory";
import { filterTreeByName } from "./utils/fileFileter";



const App: React.FC = () => {
  const fullTree = useFileSystemSelector((state) => state.crud.fullTree); // Cambiar esto

  const [sort, setSort] = useState<ESort>(ESort.None);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredAndSortedNodes = useMemo(() => {
    let nodes = fullTree;

    // Aplicar filtro
    if (searchTerm.trim()) {
      nodes = filterTreeByName(fullTree, searchTerm);
    }

    // Ordenamiento
    const sortFn = (a: HavenFileNode, b: HavenFileNode) => {
      switch (sort) {
        case ESort.NameAsc:
          return a.name.localeCompare(b.name);
        case ESort.TagAsc:
          return (a.tag ?? "").localeCompare(b.tag ?? "");
        default:
          return 0;
      }
    };

    const applySortRecursively = (nodes: HavenFileNode[]): HavenFileNode[] =>
      nodes
        .map((node) => ({
          ...node,
          children: node.children ? applySortRecursively([...node.children].sort(sortFn)) : undefined,
        }))
        .sort(sortFn);

    return applySortRecursively(nodes);
  }, [fullTree, searchTerm, sort]);

  return (
    <div className="space-y-4 bg-neutral-800 h-screen text-white">
      <SearchBar onSearchChange={setSearchTerm} />
      {/* <ToolBar onChange={setSort} /> */}
      <TreeView nodes={filteredAndSortedNodes} />

    </div>
  );
};

export default App;
