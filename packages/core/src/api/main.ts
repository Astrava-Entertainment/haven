const BASE_URL = import.meta.env.HAVEN_BASE_URL;

/**
 * HavenApiClass is a singleton class that provides methods to interact with the Haven API.
 */
class HavenApiClass {
  private static instance: HavenApiClass;

  private constructor() {}

  static getInstance(): HavenApiClass {
    if (!HavenApiClass.instance) {
      HavenApiClass.instance = new HavenApiClass();
    }
    return HavenApiClass.instance;
  }

  async fetchDocuments(query: string) {
    return this.request(`/search/documents?q=${encodeURIComponent(query)}`);
  }

  async fetchByUser(query: string) {
    return this.request(`/search/user?q=${encodeURIComponent(query)}`);
  }

  async fetchByName(query: string) {
    return this.request(`/search/name?q=${encodeURIComponent(query)}`);
  }

  async fetchByAction(query: string) {
    return this.request(`/search/action?q=${encodeURIComponent(query)}`);
  }

  async fetchByTag(query: string) {
    return this.request(`/search/tag?q=${encodeURIComponent(query)}`);
  }

  async fetchByVariant(query: string) {
    return this.request(`/search/variant?q=${encodeURIComponent(query)}`);
  }

  private async request(endpoint: string) {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Error ${res.status}: ${error}`);
    }
    return res.json();
  }
}

export const HavenApi = HavenApiClass.getInstance();
