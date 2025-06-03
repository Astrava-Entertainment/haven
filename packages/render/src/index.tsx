import { useEffect } from "react";
import App from "./app";
import { useRenderDispatch } from "./store/hooks";
import {dropFile, setFile} from "./store/slices/fileSlice";
import { HavenFile } from "../../core/src/common/havenFile.ts";
import {setMetadata} from "./store/slices/metadataSlice.ts";

function RenderApp({ file }: { file: HavenFile }) {
  const dispatch = useRenderDispatch();

  useEffect(() => {
    dispatch(setMetadata(null));
    dispatch(setFile(file));
  }, [file, dispatch]);

  return <App />;
}

export default RenderApp;
