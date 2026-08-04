import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".standalone",
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../.standalone-dist",
    emptyOutDir: true,
  },
});
