import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@astrava/design-system": path.resolve(__dirname, "../design-system"),
    },
  },
});
