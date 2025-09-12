import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "lib/useIndex.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "cjs" ? "cjs" : "mjs"}`,
    },
    rollupOptions: {
      output: {
        assetFileNames: "[name][extname]", // tailwind.scss
      },
    },
  },
  css: {},
});
