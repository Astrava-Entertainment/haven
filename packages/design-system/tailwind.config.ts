import type { Config } from "tailwindcss";

const config: Config = {
  content: ["../../packages/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
