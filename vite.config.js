import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: resolve(__dirname, "src"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/js/cassettecss.js"),
      name: "CassetteCSS",
      fileName: (format) => `cassettecss.${format}.js`,
      formats: ["umd", "es"],
    },
    rollupOptions: {
      output: {
        exports: "named",
        assetFileNames: "cassettecss.[ext]",
      },
    },
  },
});
