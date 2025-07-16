export const isDirectoryNode = (node: IHavenTreeNode): node is IHavenDirectory => {
  return 'children' in node;
};
