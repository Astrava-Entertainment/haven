import { KEYMAP } from "../common/keymap";

export function getActionFromKeyEvent(e: KeyboardEvent): string | null {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case "m":
        return KEYMAP.OPEN;
      case "d":
        return KEYMAP.DELETE;
      case "c":
        return KEYMAP.COPY;
      case "x":
        return KEYMAP.CUT;
      case "n":
        return KEYMAP.RENAME;
      default:
        return null;
    }
  }

  if (e.key === "Enter") return KEYMAP.OPEN;
  return null;
}

export function getActionFromMouseEvent(e: React.MouseEvent): string | null {
  if (e.ctrlKey && e.button === 0) return KEYMAP.OPEN;
  return null;
}
