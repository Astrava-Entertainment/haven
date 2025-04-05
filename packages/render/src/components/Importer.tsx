import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../core/src/store/slices/globalStore";
import { useEffect, useRef } from "react";
import {
  setModelData,
  setSolid,
  setWireframe,
} from "../store/slices/controlsSlice";
import { EFileType, EHavenMeshRenderMode } from "../common";
import { HavenLogo3D } from "./havenLogo3D";
import { GLTFRenderer } from "./renders/gltfRenderer";
import * as THREE from "three";

// Function for centering the model at (0,0,0)
const centerModel = (model: any) => {
  if (!model || !model.children || model.children.length === 0) return;
  // Calculate the bounding box of the model and obtain its center
  let boundingBox = new THREE.Box3().setFromObject(model);
  let center = new THREE.Vector3();
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

export function Importer() {
  const modelRef = useRef<any>(null);
  const dispatch = useDispatch();

  const fileData = useSelector((state: RootState) => state.core.file);
  const renderMode = useSelector(
    (state: RootState) => state.render.controls.renderMode
  ) as EHavenMeshRenderMode;
  const isWireframe = renderMode === EHavenMeshRenderMode.wireframe;

  const handleClick = () => {
    dispatch(isWireframe ? setSolid(undefined) : setWireframe(undefined));
  };

  useEffect(() => {
    if (!fileData || !fileData.url || !modelRef.current) return;
    centerModel(modelRef.current);
    applyWireframe(modelRef.current, isWireframe);

    const modelData = {
      position: modelRef.current.position.toArray(),
      rotation: modelRef.current.rotation.toArray(),
      scale: modelRef.current.scale.toArray(),
    };

    dispatch(setModelData(modelData));
  }, [fileData, isWireframe]);

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
