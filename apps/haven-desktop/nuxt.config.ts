// https://nuxt.com/docs/api/configuration/nuxt-config
import HavenPreset from './theme/haven-preset';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  //* Enables the development server to be discoverable by other devices when running on iOS physical devices
  // devServer: {
  //   host: '0'
  // },
  modules: ['@primevue/nuxt-module', '@nuxt/fonts', 'nuxt-phosphor-icons'],
  fonts: {
    families: [
      { name: 'Laila', provider: 'google' },
      { name: 'Inclusive Sans', provider: 'google' },
    ],
  },
  css: ['../assets/css/main.css', 'primeflex/primeflex.css'],
  primevue: {
    options: {
      theme: {
        preset: HavenPreset,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false
        }
      }
    }
    // options: {
    //   theme: {
    //     preset: HavenPreset,
    //   },
    // },
  },
  vite: {
    // Better support for Tauri CLI output
    clearScreen: false,
    // Enable environment variables
    // Additional environment variables can be found at
    // https://v2.tauri.app/reference/environment-variables/
    envPrefix: ['VITE_', 'TAURI_'],
    server: {
      // Tauri requires a consistent port
      strictPort: true,
    },
  },
  // Avoids error [unhandledRejection] EMFILE: too many open files, watch
  ignore: ['**/src-tauri/**'],
  telemetry: false,
});