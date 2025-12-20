import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Force esbuild minifier so Vercel doesn't try to use terser
    minify: "esbuild",
    // Avoid multiple JS chunks; ship a single bundle to prevent on-scroll chunk loads
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Keep CSS in a single file as well
    cssCodeSplit: false,
  },
  server: {
    port: 8080,
  },
});
