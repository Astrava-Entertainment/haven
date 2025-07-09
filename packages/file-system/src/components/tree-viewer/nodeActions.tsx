import React from 'react';
import { HavenFile } from '@haven/core/shared';

interface NodeActionsProps {
  node: IHavenDirectory | HavenFile;
}

const HavenFileActions: EHavenFileActions[] = ['Rename', 'Paste', 'Copy', 'Cut', 'Delete'];

export const NodeActions: React.FC<NodeActionsProps> = ({ node }) => {
  const handleAction = (action: HavenFileActions) => {
    console.log(`Action ${action} on ${node.name}`);
  };

  return (
    <div className="ml-2 text-sm space-x-2 text-blue-400">
        <div className='flex flex-col'>
          {Object.values(HavenFileActions).map((action) => (
            <div>
              <button
                key={action}
                onClick={() => handleAction(action)}
                className="hover:underline"
              >
                {action}
              </button>
            </div>
          ))}
        </div>
    </div>
  );
};
