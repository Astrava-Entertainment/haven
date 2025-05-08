// src/render/src/index.tsx
import { useEffect } from "react";
import { RenderProvider } from "./store/provider";
import App from "./app";
import { useRenderDispatch } from "./store/hooks";
import { setFile } from "./store/slices/fileSlice";
import { HavenFile } from "packages/core/src/common/file";

function RenderAppWrapper({ file }: { file: HavenFile }) {
  return (
    <RenderProvider>
      <RenderApp file={file} />
    </RenderProvider>
  );
}

function RenderApp({ file }: { file: HavenFile }) {
  const dispatch = useRenderDispatch();

  useEffect(() => {
    console.log(file);
    dispatch(setFile(file));
  }, [file, dispatch]);

  return <App />;
}

export default RenderAppWrapper;
