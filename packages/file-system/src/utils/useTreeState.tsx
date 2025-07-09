import { useState } from 'react';

export const useTreeState = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const toggleExpandDirectory = (nodeId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  return {
    expanded,
    selectedNodeId,
    toggleExpandDirectory,
    setSelectedNodeId,
  };
};
