import axios from './axios';

interface IFile {
  name: string;
  id: string;
}

class HavenApiClass {
  private static instance: HavenApiClass;

  private constructor() {}

  static getInstance(): HavenApiClass {
    if (!HavenApiClass.instance) {
      HavenApiClass.instance = new HavenApiClass();
    }
    return HavenApiClass.instance;
  }

  // ------------------------
  // Buckets & Projects
  // ------------------------
  async fetchBuckets() {
    const res = await axios.get('/buckets');
    return res.data;
  }

  async fetchProjects() {
    const res = await axios.get(`/projects`);
    return res.data;
  }

  async fetchProjectHavenfs(query: string) {
    const res = await axios.get(`/project/havenfs`, { params: { id: query } });
    return res.data;
  }

  // !TODO: this must be used to get the file's path in a project
  async fetchFilesInProject(query: { file: string; directory: string }) {
    const res = await axios.get("/file", {params: query});
    return res.data;
  }


  // ------------------------
  // Downloads
  // ------------------------
  async getDownloads() {
    const res = await axios.get('/downloads');
    return res.data;
  }

  async postDownload(file: IFile) {
    const res = await axios.post('/downloads', file);
    return res.data;
  }
}

export const HavenApi = HavenApiClass.getInstance();
