export const filterTree = (nodes, searchInput) => {
  const lowerInput = searchInput.toLowerCase();
  const filtered = [];

  for (const node of nodes) {
    if (node.type === "file") {
      if (node.name.toLowerCase().includes(lowerInput)) {
        filtered.push(node);
      }
    } else {
      const filteredChildren = filterTree(node.children, searchInput);
      if (node.name.toLowerCase().includes(lowerInput)) {
        filtered.push(node);
      } else if (filteredChildren.length > 0) {
        filtered.push(...filteredChildren);
      }
    }
  }

  return filtered;
};
