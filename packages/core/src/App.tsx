import '@astrava/design-system/dist/tailwind.css'
import '@astrava/design-system/dist/style.css'
import '@astrava/design-system/css/base.css'
import '@astrava/design-system/css/global.css'

import React, { useState, useEffect, useMemo } from "react";
import rawTree from '../../file-system/examples/structure.json'
import { CollectTagsFromTree, HydrateTree } from "@astrava/file-system/src/utils/treeProcessor.ts";
import { useFileDispatch } from "../../file-system/src/store/hooks.ts";
import { loadJson } from "../../file-system/src/store/slices/crudSlice.ts";
import { TreeViewer } from "../../file-system/src/components/treeViewer.tsx";
import { treeSearch } from "../../file-system/src/utils/searcher.ts";
import { sortTreeByName, sortTreeByTag } from "../../file-system/src/utils/sorter.ts";
import { HavenFile } from './common/havenFile.ts'
import MetadataViewer from "../../render/src/components/metadataViewer.tsx";
import { IHavenDirectory, ISortType } from "../../file-system/src/common/interfaces.ts";
import { FileActions } from "../../file-system/src/components/fileActions.tsx";
import { TreeListView } from "../../file-system/src/components/treeListView.tsx";
import { TreeGridView } from "../../file-system/src/components/treeGridView.tsx";
import { ViewerHeader } from "../../file-system/src/components/viewerHeader.tsx";
import { TagsViewer } from "../../file-system/src/components/tagsViewer.tsx";
import { FileInfoViewer } from "@astrava/file-system/src/components/fileInfoViewer.tsx";
import { TabsViewer } from "@astrava/file-system/src/components/tabsViewer.tsx";
import { RendererTabs } from "@astrava/file-system/src/components/renderTabs.tsx";



const App: React.FC = () => {
  const hydratedTree = rawTree.map(HydrateTree);
  const hydratedTagsMap = CollectTagsFromTree(hydratedTree);

  const [openedFiles, setOpenedFiles] = useState<HavenFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<HavenFile | null>(null);
  const [previewFile, setPreviewFile] = useState<HavenFile | null>(null);
  const [isTagView, setIsTagView] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [filteredTree, setFilteredTree] = useState(hydratedTree);
  const [sortType, setSortType] = useState<ISortType>(ISortType.None);

  const [currentDirectory, setCurrentDirectory] = useState<HavenFile | IHavenDirectory | null>(null);
  const [currentViewMode, setCurrentViewMode] = useState<boolean>(false);
  const [directoryStack, setDirectoryStack] = useState<(HavenFile | IHavenDirectory)[]>([]);

  const [recentlyOpenedFiles, setRecentlyOpenedFiles] = useState<HavenFile[]>([]);

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
        return sortTreeByName(filteredTree);
      case ISortType.Tag:
        return sortTreeByTag(filteredTree);
      default:
        return filteredTree;
    }
  }, [sortType, filteredTree]);

  const currentTree = useMemo(() => {
    if (currentDirectory) return currentDirectory.children;
    return sorterTree;
  }, [currentDirectory, sorterTree]);

  const currentPath = useMemo(() => {
    const fullPath = [...directoryStack, currentDirectory].filter(Boolean).map(dir => dir?.name);
    return fullPath.join(" / ");
  }, [directoryStack, currentDirectory]);


  const handleViewFile = (node: HavenFile | IHavenDirectory) => {
    if (node.type === "directory") {
      if (currentDirectory) {
        setDirectoryStack(prev => [...prev, currentDirectory]);
      }
      setCurrentDirectory(node);
    } else if (node.type === "file") {
      addRecentlyOpenedFile(node as HavenFile);
      setSelectedFile(node as HavenFile);

      setOpenedFiles(prev => {
        if (prev.find(f => f.id === node.id)) return prev;
        return [...prev, node as HavenFile];
      });
    }
  };

  const addRecentlyOpenedFile = (file: HavenFile) => {
    setRecentlyOpenedFiles(prev => {
      const exists = prev.find(f => f.id === file.id);
      if (exists) {
        return [file, ...prev.filter(f => f.id !== file.id)];
      }
      return [file, ...prev].slice(0, 10);
    });
  };

  const handleCloseTab = (file: HavenFile) => {
    setOpenedFiles(prev => {
      const filtered = prev.filter(f => f.id !== file.id);
      if (selectedFile?.id === file.id) {
        if (filtered.length > 0) {
          setSelectedFile(filtered[filtered.length - 1]);
        } else {
          setSelectedFile(null);
        }
      }
      return filtered;
    });
  };

  const handleTabChange = (fileId: string) => {
    const file = openedFiles.find(f => f.id === fileId);
    if (file) setSelectedFile(file);
  };


  return (
    <div className="non-select bg-neutral-800 h-screen text-white space-y-4 w-[100vw]">
      <div className="mx-auto h-full flex">
        <div className="bg-neutral-700 p-4 flex flex-col overflow-hidden space-y-4 w-[350px]">
          <FileActions
            setSelectedFile={setSelectedFile}
            setCurrentDirectory={setCurrentDirectory}
            directoryStack={directoryStack}
            setDirectoryStack={setDirectoryStack}
            setPreviewFile={setPreviewFile}
          />
          <div className="flex-1 overflow-y-auto p-4">
            <TreeViewer
              tree={sorterTree}
              selectedFile={selectedFile}
              handleViewFile={handleViewFile}
              setPreviewFile={setPreviewFile}
            />
          </div>
          <hr />
          <TabsViewer
            hydratedTagsMap={hydratedTagsMap}
            recentlyOpenedFiles={recentlyOpenedFiles}
            handleViewFile={handleViewFile}
            setPreviewFile={setPreviewFile}
          />
        </div>


        <div className="flex flex-1 flex-col overflow-hidden relative">
          {selectedFile ? (
            <>
              <div className=" p-4 overflow-auto flex-1">
                {openedFiles.length > 0 ? (
                  <RendererTabs
                    files={openedFiles}
                    activeFileId={selectedFile?.id || null}
                    onTabChange={handleTabChange}
                    onCloseTab={handleCloseTab}
                  />
                ) : (
                  <div className="text-neutral-500 text-center mt-20">Select file</div>
                )}
              </div>
              <MetadataViewer
                className="bg-neutral-900 p-4 overflow-auto max-h-[200px]"
              />
            </>
          ) : (
            <>
              <ViewerHeader
                tree={currentTree}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                currentViewMode={currentViewMode}
                setCurrentViewMode={setCurrentViewMode}
                sortType={sortType}
                setSortType={setSortType}
                isTagView={isTagView}
                setIsTagView={setIsTagView}
                currentPath={currentPath}
              />


              {isTagView ? (
                <TagsViewer
                  tagsMap={hydratedTagsMap}
                  handleViewFile={handleViewFile}
                  setPreviewFile={setPreviewFile}
                />
              ) : currentViewMode ? (
                <TreeListView
                  tree={currentTree}
                  onDoubleClick={handleViewFile}
                />
              ) : (
                <TreeGridView
                  tree={currentTree}
                  onDoubleClick={handleViewFile}
                />
              )}

              {previewFile && (
                <div className="absolute bottom-0 left-0 right-0">
                  <FileInfoViewer
                    previewFile={previewFile}
                    setPreviewFile={setPreviewFile}
                  />
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default App;
