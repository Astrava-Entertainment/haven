import { EExtensionType } from "../common/types";

export const extensionToFileType: Record<string, EExtensionType> = {
  jpg: EExtensionType.Image,
  jpeg: EExtensionType.Image,
  png: EExtensionType.Image,

  gltf: EExtensionType.Model3D,
  glb: EExtensionType.Model3D,
  fbx: EExtensionType.Model3D,

  md: EExtensionType.Markdown,

  pdf: EExtensionType.PDF,

  mp3: EExtensionType.Audio,
};

export const getFileExtension = (extension: string): EExtensionType => {
  return extensionToFileType[extension];
};
