export function buildTree(data: any[], parentId: string = 'root') {
  return data
    .filter(item => item.parent === parentId)
    .map(item => {
      const children = item.type === 'directory'
        ? buildTree(data, item.id)
        : [];
      return { ...item, children };
    });
}
