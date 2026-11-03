import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base: "./"` keeps the built folder hostable from a domain root or any
// sub-path (GitHub Pages, R2 bucket, shared host) without a rebuild.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
