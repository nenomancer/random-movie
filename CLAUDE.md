# Random Movie

Svelte 5 + Vite SPA that shows a random movie from TMDB, with filters. Deployed on Netlify from `develop`.

## Commands
- `npm run dev` — dev server (needs `TMDB_API_KEY` in `.env`, see below)
- `npm test` — Vitest (logic tests in `src/lib/*.test.ts`; `src/App.test.ts` renders the real App in jsdom against a fake TMDB and checks the request each tab click sends)
- `npm run check` — svelte-check + tsc; should report 0 errors (warnings are known)
- `npx vite build` — production build
- `npm run format` — Prettier (config in `.prettierrc`); run it before committing
Run test, check and build before calling a change done.

## Architecture
- The live movie logic is in `src/App.svelte` (fetching, random pick, history, error/loading flow).
  There is no `src/lib/movies.ts`; don't recreate it.
- Pure helpers (`buildFilterQuery`, `fetchJson`, formatting) are in `src/lib/helpers.ts` and are tested.
  Put new pure logic there and add tests.
- Shared state lives in Svelte stores (`src/lib/stores.ts`). Constants and API URLs are in `src/lib/constants.ts`.
- Deep links are `/movie/:id`; `public/_redirects` sends every path to `index.html`.

## TMDB API key (never expose it)
- The browser only calls `/api/tmdb/*`. In production that is the Netlify Function
  `netlify/functions/tmdb.mjs` (allow-lists endpoints, adds the key server-side).
  In dev, the proxy in `vite.config.ts` does the same.
- The key is `TMDB_API_KEY` (`.env` locally, Netlify env var in production, marked secret).
  Never use a `VITE_` variable for it and never put it in client code. `.env` is gitignored.
- New TMDB endpoints must be added to the allow-list in `tmdb.mjs`.

## Gotchas
- Windows: if Vite fails with `Cannot find module @rollup/rollup-win32-x64-msvc`, run
  `npm i --no-save @rollup/rollup-win32-x64-msvc` (npm optional-deps bug; the lockfile only has the Linux binary).
- Keep Vitest on v3; v5.1.1 crashed on a trivial test in this setup.
- Analytics is the direct gtag snippet in `index.html`. The GTM container is unused; don't re-add it.
- Scoped Svelte CSS can't style elements inside child components, so most "unused selector"
  warnings are not safe to delete without checking the UI.

## Workflow
- Make small, focused changes and don't commit unless asked.
