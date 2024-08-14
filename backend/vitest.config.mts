import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
  },
  plugins: [
    swc.vite({
      swcrc: false, // do not load .swcrc config or the test files won't be found as they will be excluded
    }),
    tsconfigPaths(),
  ],
});
