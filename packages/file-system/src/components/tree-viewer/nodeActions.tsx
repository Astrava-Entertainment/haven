import React from 'react';
import { HavenFile } from '@haven/core/shared';

interface NodeActionsProps {
  node: IHavenDirectory | HavenFile;
}

export const NodeActions: React.FC<NodeActionsProps> = ({ node }) => {
  const handleAction = (action: EHavenFileActions) => {
    console.log(`Action ${action} on ${node.name}`);
  };

  return (
    <div className="ml-2 text-sm space-x-2 text-blue-400">
      {Object.values(EHavenFileActions).map((action) => (
        <button
          key={action}
          onClick={() => handleAction(action)}
          className="hover:underline"
        >
          {action}
        </button>
      ))}
    </div>
  );
};
