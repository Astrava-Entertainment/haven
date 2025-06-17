export{};

declare global {
  // This helps ensure all values in Redux are plain objects
  interface Vector3Serialized
  {
    x: number;
    y: number;
    z: number;
  }

  interface HavenMeshSerialized
  {
    vertices: number;
    edges: number;
    faces: number;
    rotation: Vector3Serialized;
    translation: Vector3Serialized;
    scale: Vector3Serialized;
  }


}
