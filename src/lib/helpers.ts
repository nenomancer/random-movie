import { get } from "svelte/store";
import {
  activeTab,
  currentFilters,
  errorMessage,
  resetFiltersSignal,
  useFilters,
} from "../lib/stores";
import {
  API,
  DEFAULT_DROPDOWN_VALUE,
  DEFAULT_FILTER,
  ERROR_MESSAGES,
  FILTER_DEFAULTS,
  TAB_NAME,
} from "./constants";
import type {
  Country,
  Filters,
  Movie,
  Person,
  TmdbCountry,
  TmdbCredits,
  TmdbMovie,
} from "./types";

export function buildFilterQuery(filters: Filters) {
  const queries: string[] = [];

  if (filters.country && filters.country != DEFAULT_DROPDOWN_VALUE) {
    queries.push(`with_origin_country=${filters.country}`);
  }

  if (filters.genres?.length) {
    queries.push(`with_genres=${filters.genres.join(",")}`);
  }

  if (filters.yearFrom) {
    const clamped = clampYearValue(filters.yearFrom);
    const from = `${clamped}-01-01`;
    queries.push(`primary_release_date.gte=${from}`);
  }

  if (filters.yearTo) {
    const clamped = clampYearValue(filters.yearTo);
    const to = `${clamped}-12-31`;
    queries.push(`primary_release_date.lte=${to}`);
  }

  if (filters.ratingFrom) {
    queries.push(`vote_average.gte=${filters.ratingFrom}`);
  }

  if (filters.ratingTo) {
    queries.push(`vote_average.lte=${filters.ratingTo}`);
  }

  if (filters.runtimeFrom) {
    queries.push(`with_runtime.gte=${filters.runtimeFrom}`);
  }

  if (filters.runtimeTo) {
    queries.push(`with_runtime.lte=${filters.runtimeTo}`);
  }

  return queries.length ? "&" + queries.join("&") : "";
}

/**
 * Interprets what a user has typed into a year box.
 *
 * Returns the year to apply (clamped to the supported range), or `null` when
 * the box should be left alone because the user is still typing.
 *
 * - While typing, only a complete 4+ digit number is acted on, so "1", "19"
 *   and "199" on the way to "1990" are not snapped to the minimum. Typing
 *   "1542" is clamped to the minimum as soon as the 4th digit arrives.
 * - On commit (blur / Enter), anything is resolved: incomplete years are
 *   clamped and empty or invalid text falls back to `fallback`.
 */
export function resolveYearInput(
  raw: string,
  fallback: number,
  commit = false,
): number | null {
  const text = raw.trim();

  if (!commit) {
    return /^\d{4,}$/.test(text) ? clampYearValue(Number(text)) : null;
  }

  const value = Number(text);
  if (text === "" || !Number.isFinite(value)) {
    return fallback;
  }
  return clampYearValue(Math.round(value));
}

function clampYearValue(input: number) {
  return clampToRange(
    input,
    FILTER_DEFAULTS.YEAR_MIN,
    FILTER_DEFAULTS.YEAR_MAX,
  );
}

/**
 * Clamps `value` into [min, max]. Anything that is not a finite number (NaN,
 * or the null a cleared number input gives) becomes `fallback` instead.
 */
export function clampToRange(
  value: number,
  min: number,
  max: number,
  fallback = min,
) {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(Math.min(value, max), min);
}

/**
 * Where the highlighted part of a dual-handle slider sits, as percentages of
 * the track measured from its left and right edges.
 */
export function rangePercent(
  from: number,
  to: number,
  min: number,
  max: number,
) {
  const span = max - min;
  if (span <= 0) {
    return { left: 0, right: 0 };
  }
  return {
    left: ((from - min) / span) * 100,
    right: ((max - to) / span) * 100,
  };
}

export function padNumber(number: number, size = 10) {
  const temp = "0000000000" + number;
  return temp.substring(temp.length - size);
}

export function formatRuntime(runtime: number) {
  return `${padNumber(Math.floor(runtime / 60), 2)}:${padNumber(runtime % 60, 2)}`;
}

export function showResultError(message: string = ERROR_MESSAGES.NO_MATCH) {
  console.error(message);
  errorMessage.set(message);
  activeTab.set(TAB_NAME.ERROR);
}

// The filters that differ from their defaults. Default year/rating bounds are
// left out: they would silently drop titles with no or future release dates.
function activeFilters(filters: Filters): Filters {
  return {
    country: filters.country,
    genres: filters.genres,
    yearFrom:
      filters.yearFrom !== DEFAULT_FILTER.yearFrom
        ? filters.yearFrom
        : undefined,
    yearTo:
      filters.yearTo !== DEFAULT_FILTER.yearTo ? filters.yearTo : undefined,
    ratingFrom:
      filters.ratingFrom !== DEFAULT_FILTER.ratingFrom
        ? filters.ratingFrom
        : undefined,
    ratingTo:
      filters.ratingTo !== DEFAULT_FILTER.ratingTo
        ? filters.ratingTo
        : undefined,
  };
}

/**
 * Turns the current filter state into a query string, sending only values the
 * user actually changed. Defaults (the full year range, ratings 0-10, "Any"
 * country) are left out: TMDB's date bounds also drop titles with no or future
 * release dates, which would quietly shrink the pool.
 */
export function buildActiveFilterQuery(filters: Filters) {
  return buildFilterQuery(activeFilters(filters));
}

/**
 * Query for one search: the user's filters (when given) with the values in
 * `overrides` taking precedence, e.g. a country picked from a tab replaces the
 * country filter for that search only. Each parameter is sent once.
 */
export function buildSearchQuery(
  filters: Filters | undefined,
  overrides: Filters = {},
) {
  return buildFilterQuery(mergeSearchFilters(filters, overrides));
}

function mergeSearchFilters(
  filters: Filters | undefined,
  overrides: Filters,
): Filters {
  return { ...(filters ? activeFilters(filters) : {}), ...overrides };
}

/**
 * "Nothing matched" message for a search, naming what it was limited by so the
 * user knows what to loosen. Falls back to the generic message when the search
 * had no limits at all.
 */
export function noMatchMessage(
  filters: Filters | undefined,
  overrides: Filters = {},
) {
  const f = mergeSearchFilters(filters, overrides);
  const limits = [
    f.country && f.country !== DEFAULT_DROPDOWN_VALUE && "country",
    f.genres?.length && "genre",
    (f.yearFrom !== undefined || f.yearTo !== undefined) && "years",
    (f.ratingFrom !== undefined || f.ratingTo !== undefined) && "rating",
    (f.runtimeFrom || f.runtimeTo) && "runtime",
  ].filter(Boolean);

  if (!limits.length) return ERROR_MESSAGES.NO_MATCH;
  return `Archive scan complete: no matches for ${limits.join(" + ")}; recalibrate and scan again`;
}

// JSON.stringify with object keys sorted, so the same values compare equal
// whatever order the keys were added in.
function stableStringify(value: unknown) {
  return JSON.stringify(value, (_key, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(
          Object.entries(v).sort(([a], [b]) => a.localeCompare(b)),
        )
      : v,
  );
}

export function checkFilterEnable() {
  if (stableStringify(get(currentFilters)) == stableStringify(DEFAULT_FILTER)) {
    useFilters.set(false);
  } else {
    useFilters.set(true);
  }
}

/**
 * Puts every filter back to its default and switches "use filters" off.
 * The filter components keep their own slider/dropdown state, so they listen to
 * `resetFiltersSignal`, which is raised briefly here.
 */
export function resetFilters() {
  currentFilters.set(DEFAULT_FILTER);
  useFilters.set(false);
  resetFiltersSignal.set(true);
  setTimeout(() => resetFiltersSignal.set(false));
}

/**
 * GET a TMDB (proxy) URL and parse the JSON body.
 * Throws on network errors and non-2xx responses so callers can `.catch`.
 */
export async function fetchJson<T = any>(url: string): Promise<T> {
  const response = await fetch(url, API.OPTIONS);
  if (!response.ok) {
    throw Object.assign(
      new Error(`TMDB request failed (${response.status}): ${url}`),
      { status: response.status },
    );
  }
  return response.json();
}

// --- What each info-tab click searches for ---
// Passed to buildSearchQuery as overrides: each replaces the matching filter
// for that one search.

export const overridesForYear = (year: number): Filters => ({
  yearFrom: year,
  yearTo: year,
});

export const overridesForRuntime = (runtime: number): Filters => ({
  runtimeFrom: runtime,
  runtimeTo: runtime,
});

// Fuzzy search, votes are not too reliable and the API allows only averages
export const RATING_SEARCH_RANGE = 0.25;
export const overridesForRating = (rating: number): Filters => ({
  ratingFrom: rating - RATING_SEARCH_RANGE,
  ratingTo: rating + RATING_SEARCH_RANGE,
});

export const overridesForCountry = (countryCode: string): Filters => ({
  country: countryCode,
});

export const overridesForGenre = (genreId: number): Filters => ({
  genres: [String(genreId)],
});

// --- Turning TMDB responses into our own types ---

/** "Original (English)" for foreign-language films, else just the original. */
export function formatMovieTitle(
  originalTitle: string,
  englishTitle: string,
  originalLanguage: string,
) {
  if (originalLanguage !== "en" && originalTitle != englishTitle) {
    return `${originalTitle} (${englishTitle})`;
  }
  return originalTitle;
}

/**
 * The movie fields that come from TMDB's main details response. Image fields
 * are left out when TMDB has none, so they keep their defaults. `country` is
 * undefined when the origin isn't in `countries`; the UI shows "-" for that.
 */
export function mapMovieDetails(
  data: TmdbMovie,
  countries: Country[],
): Partial<Movie> {
  return {
    ...(data.backdrop_path && {
      backdrop: `${API.POSTER}/${data.backdrop_path}`,
    }),
    ...(data.poster_path && { poster: `${API.POSTER}/${data.poster_path}` }),
    id: data.id,
    title: {
      imdb: "",
      name: formatMovieTitle(
        data.original_title,
        data.title,
        data.original_language,
      ),
    },
    year: data.release_date
      ? new Date(data.release_date).getFullYear()
      : undefined,
    rating:
      data.vote_average > 0
        ? Math.round(data.vote_average * 10) / 10
        : undefined,
    runtime: data.runtime > 0 ? data.runtime : undefined,
    country: countries.find(
      (country) => country.code === data.origin_country?.[0],
    ) as Country,
    genres: data.genres,
    plot: data.overview,
  };
}

/** The crew entries whose job is Director. */
export function directorsOf<T extends Pick<Person, "job">>(crew: T[]) {
  return crew.filter((person) => person.job === "Director");
}

/** Directors, and the first five cast members, from a credits response. */
export function mapCredits(data: TmdbCredits) {
  return {
    directors: directorsOf(data.crew).map(({ id, name }) => ({ id, name })),
    actors: data.cast.slice(0, 5).map(({ id, name }) => ({ id, name })),
  };
}

export function mapCountries(response: TmdbCountry[]): Country[] {
  return response.map((country) => ({
    code: country.iso_3166_1,
    name: country.english_name,
    native: country.native_name,
  }));
}

/** IMDb link for an id from TMDB, or "" when TMDB has no IMDb id. */
export function imdbUrl(imdbId: string | null | undefined) {
  return imdbId ? `https://www.imdb.com/title/${imdbId}/` : "";
}

/** One random item, or undefined for an empty or missing list. */
export function pickRandom<T>(items: T[] | undefined, random = Math.random) {
  if (!items?.length) return undefined;
  return items[Math.floor(random() * items.length)];
}

/** The movie id in a deep link path (/movie/123), or null for any other path. */
export function parseMoviePath(pathname: string) {
  const match = pathname.match(/^\/movie\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

/** Message for a failed load: a 404 is "not found", anything else is a failure. */
export function loadErrorMessage(err: unknown) {
  const status = (err as { status?: number } | null)?.status;
  return status === 404 ? ERROR_MESSAGES.NOT_FOUND : ERROR_MESSAGES.FAILED;
}
