export function buildTree(items: HavenFSItem[], parentId: string): HavenFSItem[] {
  return items
    .filter(item => item.parent === parentId)
    .map(item => ({
      ...item,
      children: buildTree(items, item.id)
    }));
}
