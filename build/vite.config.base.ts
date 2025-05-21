import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [dts()],
});
