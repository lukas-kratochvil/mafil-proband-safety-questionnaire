/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Vite: https://vitejs.dev/config/
// Vitest: https://vitest.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      // ignore "use client" warning since we are not using SSR: https://github.com/TanStack/query/pull/5161#issuecomment-1477389761
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
  plugins: [
    react(), // React components fast-refresh
    tsconfigPaths(), // gives Vite the ability to resolve imports using TypeScript's path mapping from tsconfig (https://vitest.dev/guide/common-errors)
  ],
  // 'server' setup is only for a local development
  server: {
    host: true, // it's a must for Docker container port mapping to work
    strictPort: true,
    port: +process.env.PORT,
    // `hmr.clientPort` and `watch.usePolling` are important for HMR to work in the Docker container
    hmr: {
      clientPort: +process.env.PORT,
    },
    watch: {
      usePolling: true,
    },
  },
  test: {
    clearMocks: true,
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    testTimeout: 20000,
  },
});
