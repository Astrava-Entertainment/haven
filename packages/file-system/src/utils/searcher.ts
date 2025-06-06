export const treeSearch = (nodes, searchInput) => {
  const { type, terms } = parseSearchInput(searchInput);

  switch (type) {
    case ISortType.Tag:
      return advancedTreeSearch(nodes, terms);

    case ISortType.Name:
      return advancedNameSearch(nodes, terms[0]);

    case ISortType.None:
    default:
      return simpleTreeSearch(nodes, terms[0]);
  }
};

const parseSearchInput = (searchInput: string): { type: ISortType, terms: string[] } => {
  const lower = searchInput.toLowerCase().trim();

  if (lower.startsWith("tags:") || lower.startsWith("tag:")) {
    const tagPart = searchInput.split(":").pop() || "";
    const tags = tagPart
      .split(",")
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);
    return { type: ISortType.Tag, terms: tags };
  }

  if (lower.startsWith("name:")) {
    const namePart = searchInput.split(":").pop() || "";
    const names = [namePart.trim().toLowerCase()].filter(t => t.length > 0);
    return { type: ISortType.Name, terms: names };
  }

  return { type: ISortType.None, terms: [searchInput.trim().toLowerCase()] };
};


const simpleTreeSearch = (nodes, searchInput) => {
  const lowerInput = searchInput.toLowerCase();
  const filtered = [];
  for (const node of nodes) {
    if (node.type === "file") {
      if (node.name.toLowerCase().includes(lowerInput)) {
        filtered.push(node);
        break;
      }
    } else {
      const filteredChildren = simpleTreeSearch(node.children, searchInput);
      if (node.name.toLowerCase().includes(lowerInput)) {
        filtered.push(node);
      } else if (filteredChildren.length > 0) {
        filtered.push(...filteredChildren);
      }
    }
  }

  return filtered;
};

const advancedTreeSearch = (nodes, inputTags) => {
  const filtered = [];

  for (const node of nodes) {
    if (node.type === "file") {
      const tags = node.tags.map(tag => tag.toLowerCase());
      const hasMatch = inputTags.some(inputTag =>
        tags.some(tag => tag.includes(inputTag))
      );
      if (hasMatch) {
        filtered.push(node);
      }
    } else {
      const filteredChildren = advancedTreeSearch(node.children, inputTags);
      if (filteredChildren.length > 0) {
        filtered.push(...filteredChildren);
      }
    }
  }

  return filtered;
};

const advancedNameSearch = (nodes, inputName) => {
  const filtered = [];

  for (const node of nodes) {
    if (node.type === "file") {
      if (node.name.toLowerCase().includes(inputName)) {
        filtered.push(node);
      }
    } else {
      const filteredChildren = advancedNameSearch(node.children, inputName);
      if (filteredChildren.length > 0 || node.name.toLowerCase().includes(inputName)) {
        filtered.push(...filteredChildren);
      }
    }
  }

  return filtered;
};
