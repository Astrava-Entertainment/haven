import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

const host: string = process.env.TAURI_DEV_HOST ?? '';

// https://vitejs.dev/config/
export default async function () {
  return {
    resolve: {
      alias: {
        '@haven/design-system': path.resolve(__dirname, '../design-system/dist'),
        '@haven/file-system': path.resolve(__dirname, '../file-system/src'),
        '@haven/render': path.resolve(__dirname, '../render/src'),
        '@haven/core': path.resolve(__dirname, './src'),
        '@haven/examples': path.resolve(__dirname, '../../examples'),
      },
    },
    plugins: [react(), tsconfigPaths()],
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: 'ws',
            host,
            port: 1421,
          }
        : undefined,
      watch: {
        // 3. tell vite to ignore watching `src-tauri`
        ignored: ['**/src-tauri/**'],
      },
    },
  };
};
