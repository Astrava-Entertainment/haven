import { MutableRefObject } from "react";
import { HavenLogo3D } from "../havenLogo3D.tsx";
import { GltfModel } from "./gltfModel.tsx";

interface ILoaderProps {
  extension: EFileType;
  fileUrl: string;
  modelRef: MutableRefObject<any>;
  isWireframe: boolean;
  onClick: () => void;
}

export const Loader = (props: ILoaderProps) => {
  const { extension, fileUrl, modelRef, isWireframe, onClick } = props;

  switch (extension) {
    case EFileType.GLTF:
    case EFileType.GLB:
      try {
        return (
          <GltfModel fileUrl={fileUrl} modelRef={modelRef} onClick={onClick} />
        );
      } catch (error) {
        console.error(`Could not load the file: ${fileUrl}`);
        return <HavenLogo3D onClick={onClick} wireframe={isWireframe} />;
      }
    case EFileType.FBX:
      console.error("FBX files are not supported yet");
      break;
    case EFileType.OBJ:
      console.error("OBJ files are not supported yet");
      break;
    case EFileType.UNKNOWN:
      console.error(`Unsupported file type ${fileUrl} ${extension}`);
      break;
    default:
      console.error("Unsupported file type chosen");
      return <HavenLogo3D onClick={onClick} wireframe={isWireframe} />;
  }
};
