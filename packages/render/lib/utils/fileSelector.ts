// TODO: Move to types
export type FileType = "fbx" | "image" | "audio" | "text" | "unknown";

export function getFileType(ext: string): FileType {
  const normalizedExt = ext.toLowerCase();

  switch (normalizedExt) {
    case "fbx":
      return "fbx";

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
      return "unknown";
  }
}
