// This helps ensure all values in Redux are plain objects
export interface Vector3Serialized {
  x: number;
  y: number;
  z: number;
}

export interface HavenMeshSerialized {
  vertices: number;
  edges: number;
  faces: number;
  rotation: Vector3Serialized;
  translation: Vector3Serialized;
  scale: Vector3Serialized;
}

export enum EExtensionType {
  Empty,
  Image,
  Model3D,
  Markdown,
  PDF,
  Audio,
}
