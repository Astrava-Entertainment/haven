export const sortTreeByName = (nodes) => {
  return nodes
    .map((node) => {
      if (node.type === 'directory') {
        return {
          ...node,
          children: sortTreeByName(node.children),
        };
      }
      return node;
    })
    .sort((a: { name: string }, b: { name: any }) => a.name.localeCompare(b.name));
};

export const sortTreeByTag = (nodes) => {
  return nodes.map((node) => {
    if (node.type === 'folder') {
      return {
        ...node,
        children: sortTreeByTag(node.children)
      };
    }
    return node;
  }).sort((a, b) => {
    const tagA = (a.tags?.[0] || '').toLowerCase();
    const tagB = (b.tags?.[0] || '').toLowerCase();
    return tagA.localeCompare(tagB);
  });
};
