
declare module "*.png"
{
  const value: string;
  export default value;
}
declare module "*.jpg"
{
  const value: string;
  export default value;
}
declare module "*.svg"
{
  const value: string;
  export default value;
}

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

interface IHavenFile
{
  id: string;
  name: string;
  type: "file";
  url: string;
  loadTime: number;
  cached: boolean;
  extension?: string;
}

interface IHavenDirectory
{
  id: string;
  name: string;
  type: "directory";
  children: (IHavenFile | IHavenDirectory)[];
}

interface HavenState
{
  tree: IHavenDirectory[];
}

/**
 * Enum for the different render modes available in the Haven Render Engine.
 */
type EHavenMeshRenderMode =
  "solid"
  | "wireframe"
  | "solidWithWireframe"
  | "albedo"
  | "metallic"
  | "roughness"
  | "normalMap"
  | "matcap"
  | "specular"
  | "emissive"
  | "ambientOcclusion"
  | "vertexNormals"
  | "uv";

type EFileType = "OBJ" | "JPG" | "FBX" | "GLTF" | "COLLADA" | "GLB" | "UNKNOWN";
type EFileExtension = "unsupported" | "image" | "mesh" | "markdown" | "pdf" | "audio";
type ESortType = "None" | "Name" | "Tag";
type EHavenFileActions = "Rename" | "Paste" | "Copy" | "Cut" | "Delete";
type ECameraPerspectiveMode = "perspective" | "orthographic";
