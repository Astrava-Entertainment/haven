import { useEffect, useRef } from "react";
import { Box3, Vector3 } from "three";
import {
  setModelData,
  setSolid,
  setWireframe,
} from "../store/slices/controlsSlice";
import { useRenderDispatch, useRenderSelector } from "../store/hooks";
import { EFileType, EHavenMeshRenderMode } from "../common";
import { HavenLogo3D } from "./havenLogo3D.tsx";
import { Loader } from "./loaders/loader.tsx";

export function Importer() {
  const modelRef = useRef<any>(null);
  const dispatch = useRenderDispatch();

  const fileData = useRenderSelector((state) => state.file.data);

  const renderMode = useRenderSelector<EHavenMeshRenderMode>(
    (state) => state.controls.renderMode
  );
  const isWireframe = renderMode === EHavenMeshRenderMode.wireframe;

  const handleClick = () => {
    dispatch(isWireframe ? setSolid(undefined) : setWireframe(undefined));
  };

  useEffect(() => {
    if (!fileData || !fileData.url) return;

    const modelData = {
      position: modelRef.current?.position.toArray(),
      rotation: modelRef.current?.rotation.toArray(),
      scale: modelRef.current?.scale.toArray(),
    };

    dispatch(setModelData(modelData));

    centerModel(modelRef.current);
  }, [fileData]);

  useEffect(() => {
    if (!modelRef.current) return;
    applyWireframe(modelRef.current, isWireframe);
  }, [isWireframe]);

  if (!fileData || !fileData.url) {
    return <HavenLogo3D onClick={handleClick} wireframe={isWireframe} />;
  }

  const fileExtensionToLoad: EFileType = getFileType(fileData.type);
  return (
    <Loader
      extension={fileExtensionToLoad}
      fileUrl={fileData.url}
      modelRef={modelRef}
      isWireframe={isWireframe}
      onClick={handleClick}
    />
  );
}

// Function for get the file type
const getFileType = (fileType: string): EFileType => {
  switch (fileType) {
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

// Function for centering the model at (0,0,0)
const centerModel = (model: any) => {
  if (!model || !model.children || model.children.length === 0) return;
  // Calculate the bounding box of the model and obtain its center
  let boundingBox = new Box3().setFromObject(model);
  let center = new Vector3();
  boundingBox.getCenter(center);
  model.position.sub(center);
};

// Function for applying wireframe mode to model meshes
const applyWireframe = (model: any, isWireframe: boolean) => {
  model.traverse((child: any) => {
    if (child.isMesh && child.material) {
      child.material.wireframe = isWireframe;
    }
  });
};
