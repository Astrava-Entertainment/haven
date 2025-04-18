export { HavenVector3 } from "./vector.ts";
export { HavenMesh } from "./mesh.ts";

/**
 * Enum for the different render modes available in the Haven Render Engine.
 */
export enum EHavenMeshRenderMode {
  //Standard render modes
  solid,
  wireframe,
  solidWithWireframe,
  //PBR render modes
  albedo,
  metallic,
  roughness,
  normalMap,
  matcap,
  specular,
  emissive,
  ambientOcclusion,
  //Information modes
  vertexNormals,
  uv,
}

export enum EFileType {
  OBJ,
  FBX,
  GLTF,
  COLLADA,
  GLB,
  UNKNOWN,
}

export enum EFileExtension {
  Empty,
  Image,
  Model3D,
  Markdown,
  PDF,
  Audio,
}
