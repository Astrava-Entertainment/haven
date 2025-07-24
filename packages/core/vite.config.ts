import * as path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { version as pkgVersion } from './package.json';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import topLevelAwait from 'vite-plugin-top-level-await';
import {ViteToml} from 'vite-plugin-toml'

const host: string = process.env.TAURI_DEV_HOST ?? '';
const platform = process.env.TAURI_ENV_PLATFORM;
process.env.VITE_APP_VERSION = pkgVersion;
if (process.env.NODE_ENV === 'production') {
  process.env.VITE_APP_BUILD_EPOCH = new Date().getTime().toString();
}

export default async function () {
  return {
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@': fileURLToPath(new URL('./lib', import.meta.url)),
        '@haven/design-system': path.resolve(__dirname, '../design-system/scss'),
        '@haven/file-system': path.resolve(__dirname, '../file-system/src'),
        '@haven/bramble-parser': path.resolve(__dirname, '../bramble-parser/src'),
        '@haven/render': path.resolve(__dirname, '../render/src'),
        '@haven/core': path.resolve(__dirname, './src'),
        '@haven/examples': path.resolve(__dirname, '../../examples'),
      },
    },
    plugins: [
      {
        name: 'havenfs',
        enforce: 'pre',
        transform(code, id) {
          if (id.endsWith('.havenfs')) {
            return {
              code: `export default ${JSON.stringify(code)}`,
              map: null,
            }
          }
        }
      },
      ViteToml(),
      vue(),
      topLevelAwait(),
      nodePolyfills(),
      vueDevTools(),
      tsconfigPaths(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia', {
            '@/store': ['useStore'],
          },
        ],
        dts: 'auto-imports.d.ts',
        vueTemplate: true,
      }),
      Components({
        globs: ['./lib/components/*.vue'],
        dts: 'components.d.ts',
      }),
    ],
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // 1. prevent vite from obscuring rust errors
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [`@use "@haven/design-system/global.scss" as *;`],
        },
      },
    },
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
    build: {
      outDir: './dist',
      // See https://web-platform-dx.github.io/web-features/ for Vite 7 default targets (baseline-widely-available)
      // See https://v2.tauri.app/reference/webview-versions/ for Tauri details
      target: platform == 'windows' ? 'chrome107' : 'safari16',
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      emptyOutDir: true,
      chunkSizeWarningLimit: 1024,
      sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
  };
};
