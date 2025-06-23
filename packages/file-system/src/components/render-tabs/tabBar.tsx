import React from 'react';
import { HavenFile } from '@haven/core/shared';
import { TabBarItem } from './tabBarItem';

interface Props {
  files: HavenFile[];
  activeFileId: string | null;
  onTabChange: (id: string) => void;
  onCloseTab: (file: HavenFile) => void;
}

export const TabBar: React.FC<Props> = ({ files, activeFileId, onTabChange, onCloseTab }) => {
  return (
    <div className="flex border-b border-neutral-700 bg-neutral-900">
      {files.map((file) => (
        <TabBarItem
          key={file.id}
          file={file}
          isActive={file.id === activeFileId}
          onClick={() => onTabChange(file.id)}
          onClose={() => onCloseTab(file)}
        />
      ))}
    </div>
  );
};
