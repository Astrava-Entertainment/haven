import React from 'react';
import { HavenFile } from '@haven/core/shared';
import { Render } from '@haven/render';

interface Props {
  file: HavenFile | null;
}

export const RenderTabContent: React.FC<Props> = ({ file }) => {
  return (
    <div className="flex-1 overflow-auto p-4 bg-neutral-800">
      {file ? (
        <Render file={file} />
      ) : (
        <div className="text-neutral-500 text-center mt-20">There is no opened files</div>
      )}
    </div>
  );
};
