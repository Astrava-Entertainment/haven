import React, { useEffect, useRef, useState } from "react";
import { dropFile, setFile } from "../store/slices/fileSlice";
import { useRenderDispatch } from "../store/hooks";
import { extensionToFileType } from "../utils/extension";

const InputFile: React.FC = () => {
  const [file, setFileState] = useState<File | null>(null);
  const dispatch = useRenderDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event?.target?.files[0] ?? null;
    if (!selectedFile) return;

    const fileType = selectedFile.name.split(".").pop()?.toLowerCase();
    const fileUrl = URL.createObjectURL(selectedFile);

    const fileData = {
      name: selectedFile.name,
      type: fileType,
      size: selectedFile.size,
      url: fileUrl,
    };

    setFileState(selectedFile);
    dispatch(setFile(fileData));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUnselectFile = () => {
    if (!file) return;

    const fileType = file.name.split(".").pop()?.toLowerCase();
    const fileUrl = URL.createObjectURL(file);

    const fileData = {
      name: file.name,
      type: fileType,
      size: file.size,
      url: fileUrl,
    };

    URL.revokeObjectURL(fileUrl);
    setFileState(null);
    dispatch(dropFile(fileData));
  };

  const acceptedExtensions = Object.keys(extensionToFileType)
    .map((ext) => `.${ext}`)
    .join(", ");

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedExtensions}
        onChange={handleFileChange}
      />

      {file && (
        <>
          <p>Selected file: {file.name}</p>
          <button
            onClick={handleUnselectFile}
            className="bg-white text-black p-1"
          >
            Remove Model
          </button>
        </>
      )}
    </div>
  );
};

export default InputFile;
