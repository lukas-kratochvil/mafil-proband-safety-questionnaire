/// <reference types="vitest" />

// eslint-disable-next-line import/no-extraneous-dependencies
import react from "@vitejs/plugin-react";
import path from "path";
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "vite";

// Vite: https://vitejs.dev/config/
// Vitest: https://vitest.dev/config/
export default defineConfig({
  plugins: [react({ fastRefresh: false })],
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
  },
})
