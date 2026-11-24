# Random Movie

Get a random movie suggestion with one click. Filter by country, genre, release year or rating,
and jump to another movie by cast member, director, year, country, rating or runtime.

**Live site:** https://nenomancer.netlify.app

## Features
- Random movie from TMDB, with poster, plot, cast, rating, runtime and an IMDb link
- Filters: country, genre, release years, rating
- "More like this" buttons: same year, country, rating, runtime, or cast/director
- Shareable links (`/movie/:id`) and a history of the last 6 results

## Tech
Svelte 5, Vite, TypeScript, Sass. Movie data from [TMDB](https://developer.themoviedb.org/reference).
Hosted on Netlify (static site + one Netlify Function that proxies TMDB so the API key stays server-side).

## Running locally
1. `npm install`
2. Create a `.env` file with `TMDB_API_KEY=<your TMDB API Read Access Token>`
   (get one free at themoviedb.org; never commit it)
3. `npm run dev`

Other commands: `npm test`, `npm run check`, `npx vite build`.

## Credits
This product uses the TMDB API but is not endorsed or certified by TMDB.
