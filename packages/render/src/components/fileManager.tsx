import React, { useRef, useState } from "react";
import { unloadFile, displayFile } from "../store/slices/fileSlice";
import { useRenderDispatch }       from "../store/hooks";
import { extensionToFileType } from "../utils/extension";

import {HavenFile} from "@haven/core/shared";

const InputFile: React.FC = () => {
  const [file, setFileState] = useState<HavenFile | null>(null);
  const dispatch = useRenderDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleLoadFile = loadFile(setFileState, dispatch, inputRef);

  const handleRemoveFile = removeFile(file, setFileState, dispatch);

  const acceptedExtensions = Object.keys(extensionToFileType)
    .map((ext) => `.${ext}`)
    .join(", ");

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedExtensions}
        onChange={handleLoadFile}
      />

      {file && (
        <>
          <p>Selected file: {file.name}</p>
          <button
            onClick={handleRemoveFile}
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

function loadFile(
  setFileState: React.Dispatch<React.SetStateAction<HavenFile>>,
  dispatch,
  inputRef: React.RefObject<HTMLInputElement>
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files[0] ?? null;
    if (!selectedFile) return;

    const fileExt = selectedFile.name.split(".").pop()?.toLowerCase();
    const fileUrl = URL.createObjectURL(selectedFile);

    const havenFile = {
      name: selectedFile.name,
      ext: fileExt,
      ref: "",
      size: selectedFile.size,
      url: fileUrl,
      havenRef: [],
      tags: [],
      historyTree: [],
    };

    setFileState(havenFile);
    dispatch(displayFile(havenFile));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
}

function removeFile(
  file: HavenFile,
  setFileState: React.Dispatch<React.SetStateAction<HavenFile>>,
  dispatch
) {
  return () => {
    if (!file) return;

    URL.revokeObjectURL(file.url);
    setFileState(null);
    dispatch(unloadFile(file));
  };
}
