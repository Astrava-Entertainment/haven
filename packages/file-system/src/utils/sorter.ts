export const sortTreeByNameAsc = (nodes) => {
  return nodes
    .map(node => {
      if (node.type === "directory") {
        return {
          ...node,
          children: sortTreeByNameAsc(node.children),
        };
      }
      return node;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const sortTreeByTagAsc = (nodes) => {
  return nodes
    .map(node => {
      if (node.type === "directory") {
        return {
          ...node,
          children: sortTreeByTagAsc(node.children),
        };
      }
      return node;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};
