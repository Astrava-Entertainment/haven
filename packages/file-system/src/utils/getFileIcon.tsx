import {
  FilePdf,
  Image,
  MusicNotesSimple,
  TextAlignJustify,
  Folder,
} from "@phosphor-icons/react";

export const getFileIcon = (name: string) => {
  const fileSize = 16;
  const extension = name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return <FilePdf size={fileSize} weight="fill" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "svg":
      return <Image size={fileSize} weight="fill" />;
    case "mp3":
    case "wav":
    case "ogg":
      return <MusicNotesSimple size={fileSize} weight="fill" />;
    case "md":
    case "txt":
      return <TextAlignJustify size={fileSize} weight="fill" />;
    default:
      return <Folder size={fileSize} weight="fill" />;
  }
};
