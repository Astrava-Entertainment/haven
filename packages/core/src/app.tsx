import '@haven/design-system/style.css';
import structure from '@haven/examples/fs/project_a/structure.json';

import React, { useState, useEffect, useMemo } from 'react';

// TODO: Please do not mix anything from redux on other packages onto the core package.
// You need to move this logic into the global context then call from there on both the store and the core package.
// The Redux store from the filesystem package is not a core package concern,
// it is a separate package that should be used only in the store context.
<<<<<<< HEAD

// import '@haven/design-system/style.css';

import React, { useState, useEffect, useMemo } from 'react';

import { useFileDispatch } from '../../file-system/src/store/hooks.ts';

import { treeSearch, sortTreeByName, sortTreeByTag, TreeViewer, HydrateTree, CollectTagsFromTree } from '@haven/file-system';
import { HavenFile } from '@haven/core/shared';
import { MetadataViewer } from '@haven/render/components/metadataViewer.tsx';
import { loadJson } from "@haven/file-system/store/slices/crudSlice.ts";

import structure from '@haven/examples/fs/project_z/structure.json';

import {RenderTabs} from "@haven/file-system";
import {FileActions} from "@haven/file-system/components/fileActions.tsx";
import {ViewerHeader} from "@haven/file-system/components/viewerHeader.tsx";
import {TreeListView} from "@haven/file-system/components/treeListView.tsx";
import {TreeGridView} from "@haven/file-system/components/treeGridView.tsx";
import {TagsViewer} from "@haven/file-system/components/tagsViewer.tsx";
import {TabsViewer} from "@haven/file-system/components/tabsViewer.tsx";
import {FileInfoViewer} from "@haven/file-system/components/fileInfoViewer.tsx";

// TODO: This must be in enum.d.ts
// enum ESortType {
//   None,
//   Name,
//   Tag
// }

=======
import { useFileDispatch } from '@haven/file-system/store/hooks';

import { treeSearch, sortTreeByName, sortTreeByTag, TreeViewer, HydrateTree, CollectTagsFromTree } from '@haven/file-system';
import { HavenFile } from '@haven/core/shared';
import { MetadataViewer } from '@haven/render/components/metadataViewer';
import { loadJson } from '@haven/file-system/store/slices/crudSlice';
import { RenderTabs } from '@haven/file-system/components/renderTabs';
import { FileActions } from '@haven/file-system/components/fileActions';
import { ViewerHeader } from '@haven/file-system/components/viewerHeader';
import { TreeListView } from '@haven/file-system/components/TreeListView';
import { TreeGridView } from '@haven/file-system/components/TreeGridView';
import { TagsViewer } from '@haven/file-system/components/TagsViewer';
import { TabsViewer } from '@haven/file-system/components/TabsViewer';
import { FileInfoViewer } from '@haven/file-system/components/FileInfoViewer';

>>>>>>> 2137f33dbf6b705c4300675b4df5e2f5b86d4bbb
const App: React.FC = () => {
  const hydratedTree = structure.map(HydrateTree);

  const hydratedTagsMap = CollectTagsFromTree(hydratedTree);

  const [openedFiles, setOpenedFiles] = useState<HavenFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<HavenFile | null>(null);
  const [previewFile, setPreviewFile] = useState<HavenFile | null>(null);
  const [isTagView, setIsTagView] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [filteredTree, setFilteredTree] = useState(hydratedTree);
<<<<<<< HEAD
  const [sortType, setSortType] = useState<ESortType>(ESortType.None);
=======
  const [sortType, setSortType] = useState<ISortType>('none');
>>>>>>> 2137f33dbf6b705c4300675b4df5e2f5b86d4bbb

  const [currentDirectory, setCurrentDirectory] = useState<HavenFile | IHavenDirectory | null>(null);
  const [currentViewMode, setCurrentViewMode] = useState<boolean>(false);
  const [directoryStack, setDirectoryStack] = useState<(HavenFile | IHavenDirectory)[]>([]);

  const [recentlyOpenedFiles, setRecentlyOpenedFiles] = useState<HavenFile[]>([]);

  const dispatch = useFileDispatch();

  useEffect(() => {
    setPreviewFile(null);
  }, [selectedFile]);

  useEffect(() => {
<<<<<<< HEAD
    dispatch(loadJson(structure))
=======
    dispatch(loadJson(rawTree));
>>>>>>> 2137f33dbf6b705c4300675b4df5e2f5b86d4bbb
  }, []);

  useEffect(() => {
    if (!searchInput) {
      setFilteredTree(hydratedTree);
    }
    else {
      setFilteredTree(treeSearch(hydratedTree, searchInput));
    }
  }, [searchInput]);

  const sorterTree = useMemo(() => {
    switch (sortType) {
<<<<<<< HEAD
      case ESortType.Name:
        return sortTreeByName(filteredTree);
      case ESortType.Tag:
=======
      case 'name':
        return sortTreeByName(filteredTree);
      case 'tag':
>>>>>>> 2137f33dbf6b705c4300675b4df5e2f5b86d4bbb
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
    const fullPath = [...directoryStack, currentDirectory].filter(Boolean).map((dir) => dir?.name);
    return fullPath.join(' / ');
  }, [directoryStack, currentDirectory]);

  const handleViewFile = (node: HavenFile | IHavenDirectory | null) => {
    if (!node) return;

    if (node.type === 'directory') {
      if (currentDirectory) {
        setDirectoryStack((prev) => [...prev, currentDirectory]);
      }
      setCurrentDirectory(node);
    }
    else if (node.type === 'file') {
      addRecentlyOpenedFile(node as HavenFile);
      setSelectedFile(node as HavenFile);

      setOpenedFiles((prev) => {
        if (prev.find((f) => f.id === node.id)) return prev;
        return [...prev, node as HavenFile];
      });
    }
  };

  const addRecentlyOpenedFile = (file: HavenFile) => {
    setRecentlyOpenedFiles((prev) => {
      const exists = prev.find((f) => f.id === file.id);
      if (exists) {
        return [file, ...prev.filter((f) => f.id !== file.id)];
      }
      return [file, ...prev].slice(0, 10);
    });
  };

  const handleCloseTab = (file: HavenFile) => {
    setOpenedFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== file.id);
      if (selectedFile?.id === file.id) {
        if (filtered.length > 0) {
          setSelectedFile(filtered[filtered.length - 1]);
        }
        else {
          setSelectedFile(null);
        }
      }
      return filtered;
    });
  };

  const handleTabChange = (fileId: string) => {
    const file = openedFiles.find((f) => f.id === fileId);
    if (file) setSelectedFile(file);
  };

<<<<<<< HEAD

=======
>>>>>>> 2137f33dbf6b705c4300675b4df5e2f5b86d4bbb
  return (
    <div className="non-select bg-neutral-800 h-screen text-white space-y-4 w-[100vw]">
      <div className="mx-auto h-full flex">
        <div className="bg-neutral-700 p-4 flex flex-col overflow-hidden space-y-4 w-[350px]">
          <FileActions
            setSelectedFile={setSelectedFile}
            setCurrentDirectory={setCurrentDirectory}
            setDirectoryStack={setDirectoryStack}
            setPreviewFile={setPreviewFile}
          />
          <div className="flex-1 overflow-y-auto p-4">
            <TreeViewer
              tree={sorterTree}
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
          {selectedFile
            ? (
                <>
                  <div className=" p-4 overflow-auto flex-1">
                    {openedFiles.length > 0
                      ? (
                          <RenderTabs
                            files={openedFiles}
                            activeFileId={selectedFile?.id || null}
                            onTabChange={handleTabChange}
                            onCloseTab={handleCloseTab}
                          />
                        )
                      : (
                          <div className="text-neutral-500 text-center mt-20">Select file</div>
                        )}
                  </div>
                  <MetadataViewer
                    className="bg-neutral-900 p-4 overflow-auto max-h-[200px]"
                  />
                </>
              )
            : (
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

<<<<<<< HEAD
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {selectedFile ? (
            <>
              <div className=" p-4 overflow-auto flex-1">
                {openedFiles.length > 0 ? (
                  <RenderTabs
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
                  onClick={setPreviewFile}
                />
              ) : (
                <TreeGridView
                  tree={currentTree}
                  onDoubleClick={handleViewFile}
                  onClick={setPreviewFile}
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

=======
                  {isTagView
                    ? (
                        <TagsViewer
                          tagsMap={hydratedTagsMap}
                          handleViewFile={handleViewFile}
                          setPreviewFile={setPreviewFile}
                        />
                      )
                    : currentViewMode
                      ? (
                          <TreeListView
                            tree={currentTree}
                            onDoubleClick={handleViewFile}
                            onClick={setPreviewFile}
                          />
                        )
                      : (
                          <TreeGridView
                            tree={currentTree}
                            onDoubleClick={handleViewFile}
                            onClick={setPreviewFile}
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

>>>>>>> 2137f33dbf6b705c4300675b4df5e2f5b86d4bbb
        </div>
      </div>
    </div>
  );
};

export default App;
