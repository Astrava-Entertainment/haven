import { HavenFile } from '@haven/core/shared';

export function findFileById(files: HavenFile[], id: string | null): HavenFile | undefined {
  return files.find((file) => file.id === id);
}

export function saveFileToStorage(file: HavenFile): void {
  try {
    localStorage.setItem(`file-${file.id}`, JSON.stringify(file));
  } catch (error) {
    console.warn(`Error saving file ${file.id} to localStorage`, error);
  }
}

export function loadFileFromStorage(id: string | null): HavenFile | null {
  if (!id) return null;

  try {
    const stored = localStorage.getItem(`file-${id}`);
    return stored ? (JSON.parse(stored) as HavenFile) : null;
  } catch (error) {
    console.warn(`Error parsing stored file with ID ${id}`, error);
    return null;
  }
}
