import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig } from "vitest/config";

// Separate from vite.config.ts on purpose: the tests don't need the TMDB dev
// proxy. The Svelte plugin is only here for the component tests (src/*.test.ts
// files that opt into jsdom with `// @vitest-environment jsdom`); the logic
// tests stay in plain Node.
export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
