import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig(({ mode }) => {
  // Load all vars (not just VITE_-prefixed) so the key stays server-side only.
  const env = loadEnv(mode, ".", "");
  const key = env.TMDB_API_KEY || env.VITE_TMDB_API_KEY;

  return {
    plugins: [svelte()],
    build: {
      outDir: "dist",
    },
    server: {
      // Dev equivalent of netlify/functions/tmdb.mjs
      proxy: {
        "/api/tmdb": {
          target: "https://api.themoviedb.org",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/tmdb/, "/3"),
          headers: { Authorization: `Bearer ${key}` },
        },
      },
    },
  };
});
