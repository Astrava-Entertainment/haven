import React from 'react';
import { HavenFile } from "../../../core/src/common/havenFile.ts";

interface FileInfoViewerProps {
  previewFile: HavenFile;
  setPreviewFile: (file: HavenFile) => void;
}

type Props = FileInfoViewerProps;

export const FileInfoViewer: React.FC<Props> = (props) => {
  const { setPreviewFile, previewFile } = props;

  const handleClose = () => {
    setPreviewFile(null);
  }

  return (
    <div className="bg-neutral-900 p-4">
      <div className="flex flex-row gap-x-4 justify-between items-center">
        <h2 className="text-xl font-semibold text-white">File Information</h2>
        <button className="bg-neutral-700 p-2" onClick={() => handleClose()}>X</button>
      </div>
      <div className="space-y-1">
        <p className="text-white">
          <span className="font-medium">Name:</span> {previewFile?.name}
        </p>
        <p className="text-white">
          <span className="font-medium">Size:</span> {previewFile?.size ? `${(previewFile.size / 1024).toFixed(2)} KB` : 'N/A'}
        </p>
        <p className="text-white">
          <span className="font-medium">Type:</span> {previewFile?.type || 'N/A'}
        </p>
        <p className="text-white">
          <span className="font-medium">Tags:</span> {previewFile?.tags && previewFile.tags.length > 0 ? previewFile.tags.join(', ') : 'None'}
        </p>
      </div>
    </div>
  );
};
