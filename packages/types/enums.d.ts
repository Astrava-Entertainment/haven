export {};

declare global {
  type ECameraPerspectiveMode = 'perspective' | 'orthographic';
  type EFileType = 'OBJ' | 'JPG' | 'FBX' | 'GLTF' | 'COLLADA' | 'GLB' | 'UNKNOWN';
  type EFileExtension = 'unsupported' | 'image' | 'mesh' | 'markdown' | 'pdf' | 'audio';
  type ESortType = 'None' | 'Name' | 'Tag';
  type EHavenFileActions = 'Rename' | 'Paste' | 'Copy' | 'Cut' | 'Delete';

  /**
   * Enum for the different render modes available in the Haven Render Engine.
   */
  type EHavenMeshRenderMode =
    'solid'
    | 'wireframe'
    | 'solidWithWireframe'
    | 'albedo'
    | 'metallic'
    | 'roughness'
    | 'normalMap'
    | 'matcap'
    | 'specular'
    | 'emissive'
    | 'ambientOcclusion'
    | 'vertexNormals'
    | 'uv';
}
