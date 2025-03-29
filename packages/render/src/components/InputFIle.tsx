import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFile } from "../../../core/src/features/render/fileReducer";

// El local guardamos el fichero como FILE,
// en el Store mandamos la informacion relevante
const InputFile: React.FC = () => {
  const [file, setFileState] = useState<File | null>(null);
  const dispatch = useDispatch();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFileState(selectedFile); // Guardar el archivo completo en el estado local

      // Almacenamos solo los datos serializables en Redux
      const fileData = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      };
      dispatch(setFile(fileData)); // Dispatch solo los datos serializables

      console.log("Archivo seleccionado:", selectedFile.name);
    }
  };

  // Función para acceder al archivo completo cuando sea necesario
  const handleLoadFile = () => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Aquí puedes cargar el archivo en tu aplicación
        console.log(reader.result); // Esto es el contenido del archivo
      };
      reader.readAsText(file); // O puedes usar otros métodos de FileReader si es un archivo binario
    }
  };

  return (
    <div>
      <input type="file" accept=".gltf" onChange={handleFileChange} />
      {file && <p>Archivo seleccionado: {file.name}</p>}
      <button onClick={handleLoadFile}>Cargar archivo</button>
    </div>
  );
};

export default InputFile;
