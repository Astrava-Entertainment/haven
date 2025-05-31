import {useFileDispatch} from "../store/hooks.ts";
import {useEffect} from "react";
import {loadJson} from "../store/slices/crudSlice.ts";


interface FileLoaderProps {
  rootDir?: {}
}

export const FileLoader: React.FC<FileLoaderProps> = ({rootDir}) => {

  const dispatch = useFileDispatch();

  useEffect(() => {
    dispatch(loadJson(rootDir))
  }, []);

  return <div>Directorio cargado en el store.</div>
}
