import { defineStore } from 'pinia';
import {HavenApi} from '@/api/haven-api.js';
import {Bramble} from 'bramble-parser'

export const useFileSystemStore = defineStore('file-system', {
  state: () => ({
    globalContent: [] as HavenFSItem[],
    fileGlobalContent: new Map<string, HavenFSItem>(),
    directoryGlobalContent: new Map<string, HavenFSItem>(),

    globalTagmap: [] as HavenFSTag[],
    globalLibraries: new Map<string, HavenFSLibraries>(),

    currentProjects: [] as string,
    currentContent: [] as HavenFSItem[],
    currentHavenFs: [] as HavenFSItem[],
    currentProject: '' as string,
    currentBucket: 'my_bucket' as string, // !TODO Implement this in the backend
  }),

  getters: {
    getCurrentHavenFs: (state) => state.currentHavenFs,
    getCurrentBucket: (state) => state.currentBucket,
    getCurrentProject: (state) => state.currentProject,
    getCurrentProjects: (state) => state.currentProjects,

    getFileByID(): (id: string) => HavenFSItem | undefined {
      return (id: string) => this.fileGlobalContent.get(id);
    },

    getDirectoryByID(): (id: string) => HavenFSItem | undefined {
      return (id: string) => this.directoryGlobalContent.get(id);
    }
  },

  actions: {
    async initializeFileSystem() {
      try {
        const { projects } = await HavenApi.fetchProjects();
        this.currentProjects = projects;

        if (projects.length > 0) {
          await this.loadHavenFile(projects[0]);
        }
      } catch (err) {
        console.error("Error initialising filesystem:", err);
      }
    },

    async loadBucket(bucketId: string) {
      try {
        const { projects } = await HavenApi.fetchProjects();
        this.currentBucket = bucketId;
        this.currentProjects = projects;
        this.currentProject = '';
        this.currentHavenFs = [];
        this.currentContent = [];

        if (!projects || projects.length === 0) {
          console.warn(`Bucket "${bucketId}" has no projects`);
        }
      } catch (err) {
        console.error(`Error loading bucket "${bucketId}":`, err);
      }
    },

    async loadHavenFile(projectName: string) {
      const fsData = await HavenApi.fetchProjectHavenfs(projectName);

      if (!fsData) {
        console.error(`No file system found for "${projectName}"`);
        return;
      }

      const myBramble = new Bramble(fsData);
      myBramble.run();

      this.globalTagmap = myBramble.getTagmap();
      this.globalLibraries = myBramble.getLibraries();

      const havenFs = myBramble.getJSON();
      this.currentProject = projectName;
      this.currentHavenFs = havenFs;
      this.currentContent = havenFs;
      this.setGlobalContent(havenFs);
    },

    clearFileSystem() {
      this.setGlobalContent([]);
      this.currentHavenFs = [];
      this.currentContent = [];
    },

    setCurrentContent(newContent: HavenFSItem[]) {
      this.currentContent = newContent;
    },

    setGlobalContent(global: HavenFSItem[]) {
      this.globalContent = global;

      this.fileGlobalContent = new Map(
        global.filter(f => f.type === 'file').map(f => [f.id, f])
      );

      this.directoryGlobalContent = new Map(
        global.filter(f => f.type === 'directory').map(f => [f.id, f])
      );
    },
  }
});
