import { defineConfig } from "vite";
import tsPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "src",
  envDir: "../",
  plugins: [tsPaths(), react(), tailwindcss()],
  build: {
    outDir: "../dist",
    emptyOutDir: true
  }
});
