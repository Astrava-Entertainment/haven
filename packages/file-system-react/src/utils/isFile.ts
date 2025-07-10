export function isProbablyFile(name: string): boolean {
  return /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(name);
}
