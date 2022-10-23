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
    globals: true,
    setupFiles: ["./test/setup.ts"],
  },
})
