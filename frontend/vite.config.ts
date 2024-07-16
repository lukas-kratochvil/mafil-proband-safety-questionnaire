/// <reference types="vitest" />

// eslint-disable-next-line import/no-extraneous-dependencies
import react from "@vitejs/plugin-react";
// eslint-disable-next-line import/no-extraneous-dependencies
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
    react({
      // must set this to false because of the error occurring while testing: "@vitejs/plugin-react can't detect preamble. Something is wrong. See https://github.com/vitejs/vite-plugin-react/pull/11#discussion_r430879201"
      fastRefresh: false,
    }),
    tsconfigPaths(), // gives Vite the ability to resolve imports using TypeScript's path mapping from tsconfig (https://vitest.dev/guide/common-errors)
  ],
  // 'server' setup is only for a local development
  server: {
    host: true, // it's a must for Docker container port mapping to work
    strictPort: true,
    port: +process.env.PORT,
  },
  test: {
    clearMocks: true,
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    testTimeout: 20000,
  },
});
