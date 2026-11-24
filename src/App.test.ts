// @vitest-environment jsdom
//
// Renders the real App with a fake TMDB and clicks the info-tab buttons, to
// check the wiring the pure helper tests can't: that each click, with filters
// set, sends the right request. Only the request URL is checked. Which movie
// comes back is random and decided by TMDB, so the fake always returns the same
// one. The filter-merging rules themselves are covered in helpers.test.ts.
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.svelte";
import { DEFAULT_FILTER, DEFAULT_MOVIE } from "./lib/constants";
import {
  activeTab,
  currentFilters,
  currentMovie,
  useFilters,
} from "./lib/stores";

type Params = Record<string, string>;

// --- Fake TMDB -------------------------------------------------------------

const MOVIE = {
  id: 5,
  title: "Amelie",
  original_title: "Amélie",
  original_language: "fr",
  release_date: "2001-04-25",
  vote_average: 8,
  runtime: 122,
  origin_country: ["FR"],
  genres: [{ id: 35, name: "Comedy" }],
  overview: "A shy waitress...",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
};

function fakeTmdb(url: string) {
  const json = (data: unknown) => ({ ok: true, json: async () => data });

  if (url.includes("/configuration/countries")) {
    return json([
      { iso_3166_1: "FR", english_name: "France", native_name: "France" },
    ]);
  }
  if (url.includes("/genre/movie/list")) {
    return json({ genres: MOVIE.genres });
  }
  if (url.includes("/discover/movie")) {
    return json({ results: [{ id: MOVIE.id }], total_pages: 3 });
  }
  if (url.includes(`/movie/${MOVIE.id}/credits`)) {
    return json({
      cast: [{ id: 11, name: "Audrey" }],
      crew: [{ id: 12, name: "Jean-Pierre", job: "Director" }],
    });
  }
  if (url.includes(`/movie/${MOVIE.id}/external_ids`)) {
    return json({ imdb_id: "tt0211915" });
  }
  if (url.includes(`/movie/${MOVIE.id}`)) {
    return json(MOVIE);
  }
  if (url.includes("/person/")) {
    return json({
      movie_credits: {
        cast: [{ id: MOVIE.id }],
        crew: [{ id: MOVIE.id, job: "Director" }],
      },
    });
  }
  return { ok: false, status: 404, json: async () => ({}) };
}

const fetchMock = vi.fn(async (url: string) => fakeTmdb(String(url)));

// --- Helpers ---------------------------------------------------------------

const urlsContaining = (part: string) =>
  fetchMock.mock.calls
    .map(([url]) => String(url))
    .filter((u) => u.includes(part));

// The query of a request, without the random page number
function queryOf(url: string): Params {
  const params = Object.fromEntries(new URL(url, "http://test").searchParams);
  delete params.page;
  return params;
}

// Loads the first movie, then returns once its buttons are usable
async function renderLoadedApp() {
  render(App);
  const year = await screen.findByRole("button", {
    name: /Release year: 2001/,
  });
  await waitFor(() => expect((year as HTMLButtonElement).disabled).toBe(false));
  // Credits arrive separately; wait for them too
  await screen.findByRole("button", { name: /Director: Jean-Pierre/ });
  await screen.findByRole("button", { name: /Actor: Audrey/ });
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  // Reduced motion: typed messages show at once instead of animating
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    })),
  );
  window.history.replaceState({}, "", "/");
  currentMovie.set(DEFAULT_MOVIE);
  currentFilters.set(DEFAULT_FILTER);
  useFilters.set(false);
  activeTab.set("Info");
  fetchMock.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// --- Tests -----------------------------------------------------------------

// Every filter set at once, each different from what the loaded movie would
// search for, so a tab that fails to replace its own filter shows up.
const ALL_FILTERS = {
  country: "US",
  genres: ["28", "12"],
  yearFrom: 1990,
  yearTo: 1999,
  ratingFrom: 6,
  ratingTo: 7,
};
const ALL_FILTERS_PARAMS: Params = {
  with_origin_country: "US",
  with_genres: "28,12",
  "primary_release_date.gte": "1990-01-01",
  "primary_release_date.lte": "1999-12-31",
  "vote_average.gte": "6",
  "vote_average.lte": "7",
};

// The buttons for the loaded movie (Amélie) and what clicking each searches for
const tabCases: Record<string, { button: RegExp; params: Params }> = {
  country: {
    button: /^Country: France/,
    params: { with_origin_country: "FR" },
  },
  year: {
    button: /^Release year: 2001/,
    params: {
      "primary_release_date.gte": "2001-01-01",
      "primary_release_date.lte": "2001-12-31",
    },
  },
  rating: {
    button: /^TMDB rating: 8/,
    params: { "vote_average.gte": "7.75", "vote_average.lte": "8.25" },
  },
  runtime: {
    button: /^Runtime: 122 minutes/,
    params: { "with_runtime.gte": "122", "with_runtime.lte": "122" },
  },
  genre: { button: /^Genre: Comedy/, params: { with_genres: "35" } },
};

async function clickTab(button: RegExp) {
  await fireEvent.click(screen.getByRole("button", { name: button }));
  await waitFor(() =>
    expect(urlsContaining("/discover/movie")).toHaveLength(1),
  );
  return urlsContaining("/discover/movie")[0];
}

describe("clicking an info tab with every filter set", () => {
  for (const [tabName, tabCase] of Object.entries(tabCases)) {
    it(`${tabName} click replaces its own filter and keeps the rest`, async () => {
      await renderLoadedApp();
      currentFilters.set({ ...DEFAULT_FILTER, ...ALL_FILTERS });
      useFilters.set(true);
      fetchMock.mockClear();

      const url = await clickTab(tabCase.button);

      expect(queryOf(url)).toEqual({
        ...ALL_FILTERS_PARAMS,
        ...tabCase.params,
      });
    });
  }

  it("ignores the filters when 'use filters' is off", async () => {
    await renderLoadedApp();
    currentFilters.set({ ...DEFAULT_FILTER, ...ALL_FILTERS });
    useFilters.set(false);
    fetchMock.mockClear();

    const url = await clickTab(tabCases.year.button);

    expect(queryOf(url)).toEqual(tabCases.year.params);
  });
});

describe("clicking an actor or director", () => {
  // On purpose: these pick from the person's whole filmography, so the active
  // filters do not apply (see getMoviesByActor in App.svelte).
  for (const [name, button, personId] of [
    ["actor", /^Actor: Audrey/, 11],
    ["director", /^Director: Jean-Pierre/, 12],
  ] as const) {
    it(`${name} click searches the person's films and ignores the filters`, async () => {
      await renderLoadedApp();
      currentFilters.set({ ...DEFAULT_FILTER, ...ALL_FILTERS });
      useFilters.set(true);
      fetchMock.mockClear();

      await fireEvent.click(screen.getByRole("button", { name: button }));

      await waitFor(() => expect(urlsContaining("/person/")).toHaveLength(1));
      expect(urlsContaining("/person/")[0]).toContain(`/person/${personId}`);
      expect(urlsContaining("/discover/movie")).toHaveLength(0);
    });
  }
});
