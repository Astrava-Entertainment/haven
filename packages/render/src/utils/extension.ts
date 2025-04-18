import { EFileExtension } from "../common";

export const extensionToFileType: Record<string, EFileExtension> = {
  jpg: EFileExtension.Image,
  jpeg: EFileExtension.Image,
  png: EFileExtension.Image,

  gltf: EFileExtension.Model3D,
  glb: EFileExtension.Model3D,
  fbx: EFileExtension.Model3D,

  md: EFileExtension.Markdown,

  pdf: EFileExtension.PDF,

  mp3: EFileExtension.Audio,
};

export const getFileExtension = (extension: string): EFileExtension => {
  return extensionToFileType[extension];
};
