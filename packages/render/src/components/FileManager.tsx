import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFile } from "../../../core/src/features/render/fileReducer";

const InputFile: React.FC = () => {
  const [file, setFileState] = useState<File | null>(null);
  const dispatch = useDispatch();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFileState(selectedFile);

      const fileUrl = URL.createObjectURL(selectedFile);

      const fileData = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        url: fileUrl,
      };

      dispatch(setFile(fileData));

      console.log("Archivo seleccionado:", fileUrl);
    }
  };

  return (
    <div>
      <input type="file" accept=".gltf" onChange={handleFileChange} />
      {file && <p>Archivo seleccionado: {file.name}</p>}
    </div>
  );
};

export default InputFile;
