/// <reference types="vitest" />

// eslint-disable-next-line import/no-extraneous-dependencies
import react from "@vitejs/plugin-react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "vite";

// Vite: https://vitejs.dev/config/
// Vitest: https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    alias: [
      {
        find: "test-utils",
        replacement: "./src/__tests__/utils.ts",
      },
    ],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
  },
})
