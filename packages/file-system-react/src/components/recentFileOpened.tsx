import { HavenFile } from "@haven/core/shared";

interface RecentFilesViewer {
  files: HavenFile[];
  handleViewFile: (file: HavenFile | null) => void;
  setPreviewFile: (file: HavenFile | null) => void;
}

type Props = RecentFilesViewer;

export const RecentFileOpened: React.FC<Props> = (props) => {
  const { files, handleViewFile, setPreviewFile } = props;

  return (
    <ul className="max-h-[200px] overflow-y-auto space-y-1">
      {files.length === 0 && <li className="text-gray-400">No recently opened files</li>}
      {files.map(file => (
        <li
          key={file.id}
          onClick={() => setPreviewFile(file)}
          onDoubleClick={() => handleViewFile(file)}
          className="cursor-pointer px-2 py-1 rounded hover:bg-neutral-600 text-gray-300 hover:text-white"
          title={file.name}
        >
          📄 {file.name}
        </li>
      ))}
    </ul>
  );
};
