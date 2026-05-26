import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  // server: {
  //   port: 4173,
  // },
  // preview: {
  //   port: 4173,
  // },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index.html",
      output: {
        entryFileNames: "app.min.js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
    minify: "terser",
    sourcemap: false,
  },
});
