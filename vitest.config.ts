import { defineConfig } from "vitest/config";

// Separate from vite.config.ts on purpose: the logic tests don't need the
// Svelte plugin or the TMDB dev proxy.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
