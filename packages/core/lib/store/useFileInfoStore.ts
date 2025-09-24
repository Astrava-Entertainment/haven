import { defineStore } from "pinia";
import { getFileType } from "@haven/render/utils/fileSelector.ts";
import {HavenApi} from '@haven/core/api/haven-api.js';
import {useFileSystemStore} from '@haven/file-system/store';

export const useFileInfoStore = defineStore("file", {
  state: () => ({
    file: null as IImportantFileInfo | null,
  }),

  getters: {
    getCurrentFile: (state) => state.file,
  },

  actions: {
    setFileToRender(file: IImportantFileInfo) {
      const ext = file.name.split(".").pop() || "";
      const type = getFileType(ext);
      this.file = {
        name: file.name,
        id: file.id,
        extension: ext,
        type,
      };
    },

    async getFileFromProject() {
      const projectName = await useFileSystemStore().getCurrentBucket;
      const path = await HavenApi.fetchFileInProject({
        file: this.file.name,
        project: projectName
      });
      return path.file;
    },

    async getFilePath(fileName) {
      const projectName = await useFileSystemStore().getCurrentBucket;
      const path = await HavenApi.fetchFileInProject({
        file: fileName,
        project: projectName
      });
      return path.file;
    },
  },
});
