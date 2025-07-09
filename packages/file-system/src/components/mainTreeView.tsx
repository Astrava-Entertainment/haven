import React from 'react'
import {isDirectoryNode} from '@haven/file-system/utils';

interface IMainTreeViewProps {
  styles: string;
  tree: IHavenTreeNode[];
  handleOpenNode: (node: IHavenTreeNode) => void;
}

export const MainTreeView: React.FC<IMainTreeViewProps> = (props) => {
  const { styles, tree, handleOpenNode } = props;

  const directories = tree.children.filter(isDirectoryNode)
  const files = tree.children.filter((node: IHavenTreeNode) => !isDirectoryNode(node))

  return (
    <div className={styles}>
      <h1>Explorer</h1>
      <div>
        {directories.map((dir: IHavenDirectory, index: number) => (
          <div
            key={`dir-${index}`}
            onDoubleClick={() => handleOpenNode(dir)}
          >
            {dir.name}
          </div>
        ))}

        {files.map((file: IHavenFile, index: number) => (
          <div
            key={`file-${index}`}
            onDoubleClick={() => handleOpenNode(file)}
          >
            {file.name}
          </div>
        ))}
      </div>
    </div>
  )

}
