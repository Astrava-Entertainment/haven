import { defineStore } from "pinia";
import { writeTextFile, exists, readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { open } from '@tauri-apps/plugin-dialog';
import { join } from "@tauri-apps/api/path";

const CONFIG_FILE = 'user_config.json';
const HAVENSYNC_FILE = '.havensync';

export const useDirectoryStore = defineStore("directory", () => {
  // The default directory chosen by the user
  let defaultDir: string | null = null;

  // Initialize the store, load the default directory if it exists
  async function init() {
    defaultDir = await getDefaultDirectory();

    // If no directory has been selected yet, prompt the user
    if (!defaultDir) {
      await setDefaultDirectory();
    }

    // Ensure the .havensync file exists in the selected directory
    if (defaultDir) {
      const havensyncExists = await fileExists(HAVENSYNC_FILE);
      if (!havensyncExists) {
        await writeFile(HAVENSYNC_FILE, JSON.stringify({})); // initialize with empty JSON
      }
    }
  }

  // Prompt the user to select a directory and save it as the default
  async function setDefaultDirectory() {
    const dir = await selectDirectory();
    if (dir) {
      defaultDir = dir;
      await saveDefaultDirectory(dir);
    }
  }

  // Open a folder selector for the user
  async function selectDirectory(): Promise<string | null> {
    const selected = await open({
      directory: true,
      multiple: false
    });
    if (typeof selected === 'string') {
      return selected;
    }
    return null;
  }

  // Save the selected directory path in the configuration file
  async function saveDefaultDirectory(path: string) {
    await writeTextFile(CONFIG_FILE, JSON.stringify({ defaultDir: path }), {
      baseDir: BaseDirectory.Document
    });
  }

  // Load the default directory from the configuration
  async function getDefaultDirectory(): Promise<string | null> {
    try {
      const content = await readTextFile(CONFIG_FILE, { baseDir: BaseDirectory.Document });
      const config = JSON.parse(content);
      return config.defaultDir || null;
    } catch (e) {
      return null; // configuration file does not exist yet
    }
  }

  // Check if a file exists in the default directory
  async function fileExists(filename: string) {
    const fullPath = await join(defaultDir, filename);

    if (!defaultDir) throw new Error("No default directory selected");
    return await exists(fullPath);
  }

  // Write data to a file in the default directory
  async function writeFile(filename: string, content: string) {
    if (!defaultDir) throw new Error("No default directory selected");
    return await writeTextFile(filename, content, { baseDir: defaultDir });
  }

  // Read data from a file in the default directory
  async function readFile(filename: string) {
    if (!defaultDir) throw new Error("No default directory selected");
    return await readTextFile(filename, { baseDir: defaultDir });
  }

  // Convenience function to read/write the .havensync file
  async function readHavenSync() {
    if (!defaultDir) throw new Error("No default directory selected");
    const existsFile = await fileExists(HAVENSYNC_FILE);
    if (existsFile) {
      return await readFile(HAVENSYNC_FILE);
    }
    return null;
  }

  async function writeHavenSync(data: any) {
    if (!defaultDir) throw new Error("No default directory selected");
    const existsFile = await fileExists(HAVENSYNC_FILE);
    if (existsFile) {
      return await writeFile(HAVENSYNC_FILE, JSON.stringify(data));
    }
    // Create the file if it doesn't exist
    return await writeFile(HAVENSYNC_FILE, JSON.stringify(data));
  }


  return {
    init,
    getDefaultDirectory,
    setDefaultDirectory,
    selectDirectory,
    fileExists,
    writeFile,
    readFile,
    readHavenSync,
    writeHavenSync
  };
});
