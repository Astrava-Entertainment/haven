import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../core/src/store/globalStore";
import { useEffect, useRef } from "react";
import { setSolid, setWireframe } from "../store/slices/controlsSlice";
import { EFileType, EHavenMeshRenderMode } from "../common";
import { HavenLogo3D } from "./havenLogo3D";
import { GLTFRenderer } from "./renders/gltfRenderer";

export default function Importer() {
  const modelRef = useRef<any>(null);
  const dispatch = useDispatch();

  const fileData = useSelector((state: RootState) => state.core.file);
  const renderMode = useSelector(
    (state: RootState) => state.render.controls
  ) as EHavenMeshRenderMode;
  const isWireframe = renderMode === EHavenMeshRenderMode.wireframe;

  const handleClick = () => {
    dispatch(isWireframe ? setSolid(undefined) : setWireframe(undefined));
  };

  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = isWireframe;
      }
    });
  }, [isWireframe]);

  if (!fileData || !fileData.url) {
    return <HavenLogo3D onClick={handleClick} wireframe={isWireframe} />;
  }

  const fileExtensionToLoad: EFileType = getFileType(fileData.name);

  switch (fileExtensionToLoad) {
    case EFileType.GLTF:
    case EFileType.GLB:
      return GLTFRenderer(fileData.url, modelRef, handleClick);
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
      return <HavenLogo3D onClick={handleClick} wireframe={isWireframe} />;
  }
}

const getFileType = (fileName: string): EFileType => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  switch (fileExtension) {
    case "gltf":
      return EFileType.GLTF;
    case "glb":
      return EFileType.GLB;
    case "fbx":
      return EFileType.FBX;
    case "obj":
      return EFileType.OBJ;
    default:
      return EFileType.UNKNOWN;
  }
};
