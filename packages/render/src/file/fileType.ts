const fileTypePatterns: [RegExp, EFileExtension][] = [
  [/\.jpe?g$/i, "image"],
  [/\.png$/i, "image"],
  [/\.gltf$/i, "mesh"],
  [/\.glb$/i, "mesh"],
  [/\.fbx$/i, "mesh"],
  [/\.md$/i, "markdown"],
  [/\.pdf$/i, "pdf"],
  [/\.mp3$/i, "audio"],
];

export const classifyFileByExtension = (filenameOrExt: string): EFileExtension =>
{
  for (const [pattern, type] of fileTypePatterns)
  {
    if (pattern.test(filenameOrExt)) return type;
  }
  return "unsupported"
};
