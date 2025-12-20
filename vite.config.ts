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
  },
  server: {
    port: 8080,
  },
});
