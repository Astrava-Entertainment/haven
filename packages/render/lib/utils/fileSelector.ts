// TODO: Move to types
export type FileType = "model" | "image" | "audio" | "text" | "unknown";

export function getFileType(ext: string): FileType {
  const normalizedExt = ext.toLowerCase();

  switch (normalizedExt) {
    case "fbx":
    case "glb":
    case "obj":
      return "model";

    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return "image";

    case "mp3":
    case "wav":
    case "ogg":
      return "audio";

    case "txt":
    case "md":
    case "json":
    case "log":
      return "text";

    default:
      return "not-supported";
  }
}
