import { defineStore } from "pinia";
import { getFileType } from "@astrava/render/lib/utils/fileSelector.ts";

// !TODO: Must provide the file's path, so we can render it instead of just the name
// !use the havenApi
export const useFileInfoStore = defineStore("file", {
  state: () => ({
    file: null as IImportantFileInfo | null,
  }),
  actions: {
    setFile(file: IImportantFileInfo) {
      const ext = file.name.split(".").pop() || "";
      const type = getFileType(ext);

      this.file = {
        name: file.name,
        id: file.id,
        extension: ext,
        type,
      };
    },
  },
});
