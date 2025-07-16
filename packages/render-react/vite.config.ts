import { defineConfig } from "vite";
import * as path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@haven/design-system": path.resolve(__dirname, "../design-system/dist"),
      "~": path.resolve(__dirname, "src"),
      "~~": path.resolve(__dirname, "assets"),
    },
  },
});
