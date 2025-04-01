import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../core/src/store/global-store";
import {useLoader} from "@react-three/fiber";
import {FC, MutableRefObject, useEffect, useRef} from "react";
import MetadataExtractor from "./metadataExtractor";
import {GLTFLoader} from "three-stdlib";
import {HavenLogo3D} from "./havenLogo3D.tsx";
import {EFileType, EHavenMeshRenderMode} from "../common";
import {setSolid, setWireframe} from "../store/slices/controlsSlice.ts";


interface IFileRendererProps {
  modelRef: MutableRefObject<any>,
  file: string,
  onClick: Function
}

const GLTFRenderer: FC = (props: IFileRendererProps) => {
  const {file, onClick, modelRef } = props;
  const model = useLoader(GLTFLoader, file);
  modelRef.current = model.scene;

  return (
    <>
      <MetadataExtractor model={model.scene}/>;
      {/*If this gives you a runtime error, you could change it back into onclick={onClick}*/}
      <primitive object={model.scene} scale={10} {...onClick} />
      ;
    </>
  );
}

//TODO: refactor
export default function Importer() {
  const dispatch = useDispatch();

  // Correct the selector to access the state correctly
  const fileState = useSelector((state: RootState) => state.core.file);
  const wireframeState = useSelector((state: RootState) => state.render.wireframe);
  const modelRef = useRef<any>(null);

  const handleClick = () => {
    //TODO: move to a switch case
    if (wireframeState == EHavenMeshRenderMode.solid) {
      dispatch(setWireframe());
    } else {
      dispatch(setSolid());
    }
  };

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = wireframeState;
        }
      });
    }
  }, [wireframeState]);

  if (!fileState || !fileState.url) {
    return <HavenLogo3D onClick={handleClick}/>;
  }

  const fileExtensionToLoad: EFileType = getFileType(fileState.url);

  switch (fileExtensionToLoad) {
    case EFileType.GLB:
      return <GLTFRenderer></GLTFRenderer>
    case EFileType.FBX:
      console.error("FBX files are not supported yet");
      break;
    case EFileType.OBJ:
      console.error("OBJ files are not supported yet");
      break;
    case EFileType.UNKNOWN:
      console.error("Unsupported file type");
      break;
    default:
      console.error("Unsupported file type chosen");
      return <HavenLogo3D onClick={handleClick}/>;
  }
}

const getFileType = (fileName: string): EFileType => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  switch (fileExtension) {
    case "gltf":
    case "glb":
      return EFileType.GLB;
    case "fbx":
      return EFileType.FBX;
    case "obj":
      return EFileType.OBJ;
    default:
      return EFileType.UNKNOWN;
  }
}
