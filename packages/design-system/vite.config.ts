import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "cjs" ? "cjs" : "mjs"}`,
    },
    rollupOptions: {
      output: {
        assetFileNames: "[name][extname]", // tailwind.css
      },
    },
  },
  css: {},
});
