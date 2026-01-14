import { defineConfig } from "vite";
export default defineConfig({
  base: '/why-ai-in-js/video-object-detection/dist/',
  build: {
    target: "esnext",
    outDir: 'dist',
    assetsDir: 'assets'
  },
});