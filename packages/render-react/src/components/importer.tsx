import { useEffect, useRef } from "react";
import { Box3, Vector3 } from "three";

// Question: This must be in hooks/slices?
import {
  setModelData,
  setSolid,
  setWireframe,
} from "../store/slices/controlsSlice";
import { useRenderDispatch, useRenderSelector } from "@haven/render/shared/index.ts";
import { HavenLogo3D } from "./havenLogo3D.tsx";
import { Loader } from "./loaders/loader.tsx";

export function Importer() {
  const modelRef = useRef<any>(null);
  const dispatch = useRenderDispatch();

  const fileData = useRenderSelector((state) => state.file.currentFile);

  const renderMode = useRenderSelector<EHavenMeshRenderMode>(
    (state) => state.controls.renderMode
  );

  const isWireframe = renderMode === "wireframe";

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

  const fileExtensionToLoad: EFileType = getFileType(fileData.ext);

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
      return "GLTF";
    case "jpg":
      return "JPG";
    case "glb":
      return "GLB";
    case "dae":
      return "COLLADA";
    case "fbx":
      return "FBX";
    case "obj":
      return "OBJ";
    default:
      return "UNKNOWN";
  }
};

/**
 * Centers the model in the scene by adjusting its position
 * @param model - The 3D mesh to center
 */
const centerModel = (model: any) => {
  if (!model || !model.children || model.children.length === 0) return;
  // Calculate the bounding box of the model and obtain its center
  let boundingBox = new Box3().setFromObject(model);
  let center = new Vector3();
  boundingBox.getCenter(center);
  model.position.sub(center);
};

/**
 * Applies wireframe mode to the model's materials
 * @param model - The 3D model to apply wireframe mode to
 * @param isWireframe - Boolean indicating whether to apply wireframe mode
 */
const applyWireframe = (model: any, isWireframe: boolean) => {
  model.traverse((child: any) => {
    if (child.isMesh && child.material) {
      child.material.wireframe = isWireframe;
    }
  });
};
