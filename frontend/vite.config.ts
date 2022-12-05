/// <reference types="vitest" />

// eslint-disable-next-line import/no-extraneous-dependencies
import react from "@vitejs/plugin-react";
import * as path from "path";
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Vite: https://vitejs.dev/config/
// Vitest: https://vitest.dev/config/
export default defineConfig({
  plugins: [
    react({
      // must set this to false because of the error occuring while testing: "@vitejs/plugin-react can't detect preamble. Something is wrong. See https://github.com/vitejs/vite-plugin-react/pull/11#discussion_r430879201"
      fastRefresh: false,
    }),
    tsconfigPaths(), // gives Vite the ability to resolve imports using TypeScript's path mapping from tsconfig
  ],
  test: {
    alias: [
      {
        find: "@test-utils",
        replacement: path.resolve(__dirname, "./src/__tests__/utils.ts"),
      },
    ],
    clearMocks: true,
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    testTimeout: 20000,
  },
});
