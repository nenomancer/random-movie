import { afterEach, describe, expect, it, vi } from "vitest";
import { get } from "svelte/store";
import {
  API,
  DEFAULT_FILTER,
  ERROR_MESSAGES,
  FILTER_DEFAULTS,
  TAB_NAME,
} from "./constants";
import {
  buildActiveFilterQuery,
  buildFilterQuery,
  buildSearchQuery,
  clampToRange,
  directorsOf,
  formatMovieTitle,
  noMatchMessage,
  imdbUrl,
  loadErrorMessage,
  mapCountries,
  mapCredits,
  mapMovieDetails,
  overridesForCountry,
  overridesForGenre,
  overridesForRating,
  overridesForRuntime,
  overridesForYear,
  parseMoviePath,
  pickRandom,
  rangePercent,
  checkFilterEnable,
  fetchJson,
  formatRuntime,
  padNumber,
  resetFilters,
  resolveYearInput,
  showResultError,
} from "./helpers";
import {
  activeTab,
  currentFilters,
  errorMessage,
  resetFiltersSignal,
  useFilters,
} from "./stores";

describe("buildFilterQuery", () => {
  it("returns an empty string when no filters are set", () => {
    expect(buildFilterQuery({})).toBe("");
  });

  it("ignores the default 'Any' country", () => {
    expect(buildFilterQuery({ country: "Any" })).toBe("");
  });

  it("filters by country code", () => {
    expect(buildFilterQuery({ country: "MK" })).toBe("&with_origin_country=MK");
  });

  it("joins genres with commas", () => {
    expect(buildFilterQuery({ genres: ["28", "12"] })).toBe(
      "&with_genres=28,12",
    );
  });

  it("ignores an empty genre list", () => {
    expect(buildFilterQuery({ genres: [] })).toBe("");
  });

  it("turns years into full-year date bounds", () => {
    expect(buildFilterQuery({ yearFrom: 1990, yearTo: 1999 })).toBe(
      "&primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31",
    );
  });

  it("clamps years to the supported range", () => {
    const query = buildFilterQuery({ yearFrom: 1000, yearTo: 9999 });
    expect(query).toContain(
      `primary_release_date.gte=${FILTER_DEFAULTS.YEAR_MIN}-01-01`,
    );
    expect(query).toContain(
      `primary_release_date.lte=${FILTER_DEFAULTS.YEAR_MAX}-12-31`,
    );
  });

  it("adds rating bounds", () => {
    expect(buildFilterQuery({ ratingFrom: 6.5, ratingTo: 9 })).toBe(
      "&vote_average.gte=6.5&vote_average.lte=9",
    );
  });

  it("skips a rating of 0, which is the same as no filter", () => {
    expect(buildFilterQuery({ ratingFrom: 0 })).toBe("");
  });

  it("combines several filters in one query string", () => {
    expect(buildFilterQuery({ country: "FR", ratingFrom: 7 })).toBe(
      "&with_origin_country=FR&vote_average.gte=7",
    );
  });

  // getMoviesByRuntime() in App.svelte relies on this for the "same runtime"
  // button; it used to be silently ignored.
  it("adds runtime bounds", () => {
    expect(buildFilterQuery({ runtimeFrom: 142, runtimeTo: 142 })).toBe(
      "&with_runtime.gte=142&with_runtime.lte=142",
    );
  });

  it("skips a runtime of 0, which is the same as no filter", () => {
    expect(buildFilterQuery({ runtimeFrom: 0 })).toBe("");
  });
});

describe("padNumber", () => {
  it("left-pads with zeros to the requested size", () => {
    expect(padNumber(7, 3)).toBe("007");
    expect(padNumber(42, 2)).toBe("42");
  });

  it("pads to 10 digits by default", () => {
    expect(padNumber(5)).toBe("0000000005");
  });
});

describe("formatRuntime", () => {
  it("formats minutes as HH:MM", () => {
    expect(formatRuntime(142)).toBe("02:22");
    expect(formatRuntime(60)).toBe("01:00");
    expect(formatRuntime(5)).toBe("00:05");
  });
});

describe("fetchJson", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the parsed body for a successful response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 550 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchJson(`${API.MOVIE}/550`)).resolves.toEqual({ id: 550 });
    expect(fetchMock).toHaveBeenCalledWith(`${API.MOVIE}/550`, API.OPTIONS);
  });

  it("throws on a non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }),
    );

    await expect(fetchJson(`${API.MOVIE}/0`)).rejects.toThrow("404");
  });

  it("exposes the HTTP status on the error", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }),
    );

    await expect(fetchJson(`${API.MOVIE}/0`)).rejects.toMatchObject({
      status: 404,
    });
  });

  it("does not parse the body of a failed response", async () => {
    const json = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500, json }),
    );

    await expect(fetchJson(`${API.MOVIE}/1`)).rejects.toThrow();
    expect(json).not.toHaveBeenCalled();
  });

  it("propagates network errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

    await expect(fetchJson(`${API.MOVIE}/1`)).rejects.toThrow("offline");
  });
});

describe("showResultError", () => {
  afterEach(() => {
    activeTab.set(TAB_NAME.INFO);
    vi.restoreAllMocks();
  });

  it("shows the error tab with the 'no match' message by default", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    showResultError();
    expect(get(activeTab)).toBe(TAB_NAME.ERROR);
    expect(get(errorMessage)).toBe(ERROR_MESSAGES.NO_MATCH);
  });

  it("shows a custom message when given one", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    showResultError(ERROR_MESSAGES.FAILED);
    expect(get(errorMessage)).toBe(ERROR_MESSAGES.FAILED);
  });

  it("has a distinct message for each situation", () => {
    const messages = Object.values(ERROR_MESSAGES);
    expect(new Set(messages).size).toBe(messages.length);
  });
});

describe("buildActiveFilterQuery", () => {
  const withFilters = (patch: object) => ({ ...DEFAULT_FILTER, ...patch });

  it("sends nothing when every filter is at its default", () => {
    expect(buildActiveFilterQuery(DEFAULT_FILTER)).toBe("");
  });

  it("does not add the default year range just because another filter is set", () => {
    // Default date bounds would silently drop titles with no/future release dates
    expect(buildActiveFilterQuery(withFilters({ country: "FR" }))).toBe(
      "&with_origin_country=FR",
    );
  });

  it("sends only the year bound that was changed", () => {
    expect(buildActiveFilterQuery(withFilters({ yearFrom: 1990 }))).toBe(
      "&primary_release_date.gte=1990-01-01",
    );
    expect(buildActiveFilterQuery(withFilters({ yearTo: 1999 }))).toBe(
      "&primary_release_date.lte=1999-12-31",
    );
  });

  it("sends both year bounds when both changed", () => {
    expect(
      buildActiveFilterQuery(withFilters({ yearFrom: 1990, yearTo: 1999 })),
    ).toBe(
      "&primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31",
    );
  });

  it("sends only the rating bound that was changed", () => {
    expect(buildActiveFilterQuery(withFilters({ ratingFrom: 7.5 }))).toBe(
      "&vote_average.gte=7.5",
    );
    expect(buildActiveFilterQuery(withFilters({ ratingTo: 9 }))).toBe(
      "&vote_average.lte=9",
    );
  });

  it("sends selected genres, and nothing for an empty selection", () => {
    expect(buildActiveFilterQuery(withFilters({ genres: ["28", "12"] }))).toBe(
      "&with_genres=28,12",
    );
    expect(buildActiveFilterQuery(withFilters({ genres: [] }))).toBe("");
  });

  it("ignores the 'Any' country", () => {
    expect(buildActiveFilterQuery(withFilters({ country: "Any" }))).toBe("");
  });

  it("combines everything that was changed", () => {
    expect(
      buildActiveFilterQuery(
        withFilters({
          country: "FR",
          genres: ["18"],
          yearFrom: 2000,
          ratingFrom: 7,
          ratingTo: 9,
        }),
      ),
    ).toBe(
      "&with_origin_country=FR&with_genres=18&primary_release_date.gte=2000-01-01&vote_average.gte=7&vote_average.lte=9",
    );
  });

  it("never sends the (UI-less) runtime defaults", () => {
    expect(buildActiveFilterQuery(DEFAULT_FILTER)).not.toContain("runtime");
  });
});

describe("checkFilterEnable", () => {
  const apply = (patch: object) => {
    currentFilters.update((f) => ({ ...f, ...patch }));
    checkFilterEnable();
  };

  afterEach(() => {
    currentFilters.set(DEFAULT_FILTER);
    useFilters.set(false);
  });

  it("is off when everything is at its default", () => {
    useFilters.set(true);
    checkFilterEnable();
    expect(get(useFilters)).toBe(false);
  });

  it("turns on for a country and off again when set back to Any", () => {
    apply({ country: "MK" });
    expect(get(useFilters)).toBe(true);
    apply({ country: "Any" });
    expect(get(useFilters)).toBe(false);
  });

  it("turns on for a genre and off again when all are deselected", () => {
    apply({ genres: ["28"] });
    expect(get(useFilters)).toBe(true);
    apply({ genres: [] });
    expect(get(useFilters)).toBe(false);
  });

  it("turns on for years and off again when back to the full range", () => {
    apply({ yearFrom: 1990, yearTo: 1999 });
    expect(get(useFilters)).toBe(true);
    apply({
      yearFrom: FILTER_DEFAULTS.YEAR_MIN,
      yearTo: FILTER_DEFAULTS.YEAR_MAX,
    });
    expect(get(useFilters)).toBe(false);
  });

  it("turns on for a rating and off again when back to 0-10", () => {
    apply({ ratingFrom: 7.3, ratingTo: 9 });
    expect(get(useFilters)).toBe(true);
    apply({ ratingFrom: 0, ratingTo: 10 });
    expect(get(useFilters)).toBe(false);
  });

  it("stays on while any one filter is still set", () => {
    apply({ country: "FR", ratingFrom: 8 });
    apply({ country: "Any" });
    expect(get(useFilters)).toBe(true);
    apply({ ratingFrom: 0 });
    expect(get(useFilters)).toBe(false);
  });

  it("switches back on when a filter is edited after being turned off by hand", () => {
    // Intended: editing any filter enables filtering automatically
    apply({ country: "FR" });
    useFilters.set(false);
    apply({ yearFrom: 2000 });
    expect(get(useFilters)).toBe(true);
  });

  it("does not depend on the order of the keys", () => {
    currentFilters.set({
      ratingTo: 10,
      ratingFrom: 0,
      country: "Any",
      genres: [],
      actor: "",
      director: "",
      yearFrom: FILTER_DEFAULTS.YEAR_MIN,
      yearTo: FILTER_DEFAULTS.YEAR_MAX,
      runtimeFrom: 0,
      runtimeTo: 500,
    });
    checkFilterEnable();
    expect(get(useFilters)).toBe(false);
  });
});

describe("resetFilters", () => {
  afterEach(() => {
    currentFilters.set(DEFAULT_FILTER);
    useFilters.set(false);
    resetFiltersSignal.set(false);
  });

  it("restores every filter and switches 'use filters' off", () => {
    currentFilters.update((f) => ({
      ...f,
      country: "FR",
      genres: ["28", "12"],
      yearFrom: 2000,
      ratingFrom: 8,
    }));
    useFilters.set(true);

    resetFilters();

    expect(get(currentFilters)).toEqual(DEFAULT_FILTER);
    expect(get(useFilters)).toBe(false);
  });

  it("raises the reset signal briefly so the controls reset themselves", async () => {
    resetFilters();
    expect(get(resetFiltersSignal)).toBe(true);

    await new Promise((resolve) => setTimeout(resolve));
    expect(get(resetFiltersSignal)).toBe(false);
  });

  it("never changes DEFAULT_FILTER itself", () => {
    const before = JSON.stringify(DEFAULT_FILTER);
    currentFilters.update((f) => ({ ...f, country: "FR", genres: ["28"] }));
    resetFilters();
    currentFilters.update((f) => ({ ...f, yearFrom: 2001 }));
    expect(JSON.stringify(DEFAULT_FILTER)).toBe(before);
  });
});

describe("resolveYearInput", () => {
  const { YEAR_MIN, YEAR_MAX } = FILTER_DEFAULTS;

  describe("while typing", () => {
    it("leaves incomplete years alone (null = don't touch the box or the filter)", () => {
      for (const partial of ["", "1", "19", "199"]) {
        expect(resolveYearInput(partial, YEAR_MIN)).toBeNull();
      }
    });

    it("accepts a complete 4-digit year in range", () => {
      expect(resolveYearInput("1990", YEAR_MIN)).toBe(1990);
      expect(resolveYearInput(String(YEAR_MIN), YEAR_MIN)).toBe(YEAR_MIN);
      expect(resolveYearInput(String(YEAR_MAX), YEAR_MIN)).toBe(YEAR_MAX);
    });

    it("clamps a complete year below the minimum as soon as it is typed", () => {
      expect(resolveYearInput("1542", YEAR_MIN)).toBe(YEAR_MIN);
      expect(resolveYearInput("0001", YEAR_MIN)).toBe(YEAR_MIN);
    });

    it("clamps a complete year above the maximum", () => {
      expect(resolveYearInput("2999", YEAR_MIN)).toBe(YEAR_MAX);
      expect(resolveYearInput("9999", YEAR_MIN)).toBe(YEAR_MAX);
    });

    it("clamps overlong input instead of accepting it", () => {
      expect(resolveYearInput("19901", YEAR_MIN)).toBe(YEAR_MAX);
    });

    it("ignores non-numeric text", () => {
      expect(resolveYearInput("19a", YEAR_MIN)).toBeNull();
      expect(resolveYearInput("-1990", YEAR_MIN)).toBeNull();
      expect(resolveYearInput("1e3", YEAR_MIN)).toBeNull();
      expect(resolveYearInput("1990.5", YEAR_MIN)).toBeNull();
    });

    it("works through a whole typing sequence", () => {
      const steps = ["1", "19", "199", "1990"].map((v) =>
        resolveYearInput(v, YEAR_MIN),
      );
      expect(steps).toEqual([null, null, null, 1990]);
      const tooLow = ["1", "15", "154", "1542"].map((v) =>
        resolveYearInput(v, YEAR_MIN),
      );
      expect(tooLow).toEqual([null, null, null, YEAR_MIN]);
    });
  });

  describe("on commit (blur / Enter)", () => {
    it("clamps an incomplete year up to the minimum", () => {
      expect(resolveYearInput("15", YEAR_MIN, true)).toBe(YEAR_MIN);
      expect(resolveYearInput("199", YEAR_MIN, true)).toBe(YEAR_MIN);
    });

    it("falls back when empty or not a number", () => {
      expect(resolveYearInput("", YEAR_MIN, true)).toBe(YEAR_MIN);
      expect(resolveYearInput("", YEAR_MAX, true)).toBe(YEAR_MAX);
      expect(resolveYearInput("abc", YEAR_MAX, true)).toBe(YEAR_MAX);
    });

    it("keeps a valid year, ignoring surrounding spaces", () => {
      expect(resolveYearInput("1990", YEAR_MIN, true)).toBe(1990);
      expect(resolveYearInput(" 1990 ", YEAR_MIN, true)).toBe(1990);
    });

    it("rounds decimals and clamps negatives / exponents", () => {
      expect(resolveYearInput("1990.4", YEAR_MIN, true)).toBe(1990);
      expect(resolveYearInput("-5", YEAR_MIN, true)).toBe(YEAR_MIN);
      expect(resolveYearInput("1e9", YEAR_MIN, true)).toBe(YEAR_MAX);
    });
  });
});

describe("query edge cases", () => {
  it("skips a NaN year instead of sending it", () => {
    expect(buildFilterQuery({ yearFrom: NaN, yearTo: NaN })).toBe("");
  });

  it("clamps each year bound on its own", () => {
    expect(buildFilterQuery({ yearFrom: 1000 })).toBe(
      `&primary_release_date.gte=${FILTER_DEFAULTS.YEAR_MIN}-01-01`,
    );
    expect(buildFilterQuery({ yearTo: 9999 })).toBe(
      `&primary_release_date.lte=${FILTER_DEFAULTS.YEAR_MAX}-12-31`,
    );
    expect(buildFilterQuery({ yearFrom: 9999 })).toBe(
      `&primary_release_date.gte=${FILTER_DEFAULTS.YEAR_MAX}-01-01`,
    );
  });

  it("skips an empty-string country", () => {
    expect(buildFilterQuery({ country: "" })).toBe("");
  });

  it("skips a rating upper bound of 0", () => {
    expect(buildFilterQuery({ ratingTo: 0 })).toBe("");
  });

  it("sends a single genre without a trailing comma", () => {
    expect(buildFilterQuery({ genres: ["18"] })).toBe("&with_genres=18");
  });

  it("passes an inverted year range through as-is (the sliders prevent it)", () => {
    expect(buildFilterQuery({ yearFrom: 2000, yearTo: 1990 })).toBe(
      "&primary_release_date.gte=2000-01-01&primary_release_date.lte=1990-12-31",
    );
  });

  it("buildActiveFilterQuery copes with a completely empty filter object", () => {
    expect(buildActiveFilterQuery({})).toBe("");
  });
});

describe("buildSearchQuery", () => {
  const withFilters = (patch: object) => ({ ...DEFAULT_FILTER, ...patch });

  it("uses only the overrides when filters are not in use", () => {
    expect(buildSearchQuery(undefined, { country: "FR" })).toBe(
      "&with_origin_country=FR",
    );
  });

  it("is empty with no filters and no overrides", () => {
    expect(buildSearchQuery(undefined)).toBe("");
  });

  it("keeps the active filters when there are no overrides", () => {
    expect(buildSearchQuery(withFilters({ genres: ["28"] }))).toBe(
      "&with_genres=28",
    );
  });

  it("keeps the other filters and replaces the country for this search", () => {
    const filters = withFilters({
      country: "US",
      genres: ["28"],
      ratingFrom: 7,
    });
    const query = buildSearchQuery(filters, { country: "FR" });
    expect(query).toContain("with_origin_country=FR");
    expect(query).not.toContain("US");
    expect(query).toContain("with_genres=28");
    expect(query).toContain("vote_average.gte=7");
  });

  it("replaces the year range instead of sending the bounds twice", () => {
    const filters = withFilters({ yearFrom: 1990, yearTo: 1999 });
    const query = buildSearchQuery(filters, { yearFrom: 1995, yearTo: 1995 });
    expect(query).toBe(
      "&primary_release_date.gte=1995-01-01&primary_release_date.lte=1995-12-31",
    );
  });
});

describe("clampToRange", () => {
  it("leaves a value inside the range alone", () => {
    expect(clampToRange(5, 0, 10)).toBe(5);
  });

  it("clamps to the nearest bound", () => {
    expect(clampToRange(-3, 0, 10)).toBe(0);
    expect(clampToRange(42, 0, 10)).toBe(10);
  });

  it("uses the fallback for NaN and for a cleared input (null)", () => {
    expect(clampToRange(NaN, 0, 10, 10)).toBe(10);
    expect(clampToRange(null as unknown as number, 0, 10, 10)).toBe(10);
  });

  it("falls back to min when no fallback is given", () => {
    expect(clampToRange(NaN, 2, 10)).toBe(2);
  });
});

describe("rangePercent", () => {
  it("covers the whole track for the full range", () => {
    expect(rangePercent(0, 10, 0, 10)).toEqual({ left: 0, right: 0 });
  });

  it("measures each edge from its own side", () => {
    expect(rangePercent(2.5, 7.5, 0, 10)).toEqual({ left: 25, right: 25 });
  });

  it("handles a range that does not start at zero", () => {
    expect(rangePercent(1950, 2000, 1900, 2000)).toEqual({
      left: 50,
      right: 0,
    });
  });

  it("does not divide by zero for an empty span", () => {
    expect(rangePercent(5, 5, 5, 5)).toEqual({ left: 0, right: 0 });
  });
});

describe("formatMovieTitle", () => {
  it("keeps the original title for English-language films", () => {
    expect(formatMovieTitle("Heat", "Heat", "en")).toBe("Heat");
  });

  it("adds the English title for foreign-language films", () => {
    expect(formatMovieTitle("Parasite", "Parasite", "ko")).toBe("Parasite");
    expect(formatMovieTitle("Amélie", "Amelie", "fr")).toBe("Amélie (Amelie)");
  });

  it("does not repeat an English title that is the same", () => {
    expect(formatMovieTitle("Roma", "Roma", "es")).toBe("Roma");
  });
});

describe("mapMovieDetails", () => {
  const countries = [
    { code: "FR", name: "France", native: "France" },
    { code: "US", name: "United States", native: "United States" },
  ];
  const details = {
    id: 5,
    title: "Amelie",
    original_title: "Amélie",
    original_language: "fr",
    release_date: "2001-04-25",
    vote_average: 7.9876,
    runtime: 122,
    origin_country: ["FR"],
    genres: [{ id: 35, name: "Comedy" }],
    overview: "A shy waitress...",
    poster_path: "/poster.jpg",
    backdrop_path: "/backdrop.jpg",
  };

  it("maps the basic fields", () => {
    const movie = mapMovieDetails(details, countries);
    expect(movie.id).toBe(5);
    expect(movie.title).toEqual({ imdb: "", name: "Amélie (Amelie)" });
    expect(movie.year).toBe(2001);
    expect(movie.rating).toBe(8);
    expect(movie.runtime).toBe(122);
    expect(movie.country).toEqual(countries[0]);
    expect(movie.genres).toEqual(details.genres);
    expect(movie.plot).toBe("A shy waitress...");
  });

  it("builds image urls from the paths", () => {
    const movie = mapMovieDetails(details, countries);
    expect(movie.poster).toBe(`${API.POSTER}/${details.poster_path}`);
    expect(movie.backdrop).toBe(`${API.POSTER}/${details.backdrop_path}`);
  });

  it("leaves image fields out when TMDB has none", () => {
    const movie = mapMovieDetails(
      { ...details, poster_path: null, backdrop_path: undefined },
      countries,
    );
    expect("poster" in movie).toBe(false);
    expect("backdrop" in movie).toBe(false);
  });

  it("treats a zero rating, zero runtime or missing date as unknown", () => {
    const movie = mapMovieDetails(
      { ...details, vote_average: 0, runtime: 0, release_date: "" },
      countries,
    );
    expect(movie.rating).toBeUndefined();
    expect(movie.runtime).toBeUndefined();
    expect(movie.year).toBeUndefined();
  });

  it("has no country when the origin is unknown or missing", () => {
    expect(
      mapMovieDetails({ ...details, origin_country: ["ZZ"] }, countries)
        .country,
    ).toBeUndefined();
    expect(
      mapMovieDetails({ ...details, origin_country: undefined }, countries)
        .country,
    ).toBeUndefined();
  });
});

describe("credits helpers", () => {
  const crew = [
    { id: 1, name: "A", job: "Director" },
    { id: 2, name: "B", job: "Writer" },
    { id: 3, name: "C", job: "Director" },
  ];

  it("directorsOf keeps only directors", () => {
    expect(directorsOf(crew).map((p) => p.id)).toEqual([1, 3]);
  });

  it("mapCredits returns directors and the first five actors", () => {
    const cast = Array.from({ length: 8 }, (_, i) => ({
      id: 10 + i,
      name: `Actor ${i}`,
      character: "x",
    }));
    const credits = mapCredits({ crew, cast });
    expect(credits.directors).toEqual([
      { id: 1, name: "A" },
      { id: 3, name: "C" },
    ]);
    expect(credits.actors).toHaveLength(5);
    expect(credits.actors[0]).toEqual({ id: 10, name: "Actor 0" });
  });
});

describe("mapCountries", () => {
  it("renames TMDB's fields", () => {
    expect(
      mapCountries([
        {
          iso_3166_1: "MK",
          english_name: "North Macedonia",
          native_name: "Македонија",
        },
      ]),
    ).toEqual([{ code: "MK", name: "North Macedonia", native: "Македонија" }]);
  });
});

describe("imdbUrl", () => {
  it("builds the title link", () => {
    expect(imdbUrl("tt0211915")).toBe("https://www.imdb.com/title/tt0211915/");
  });

  it("is empty when TMDB has no IMDb id", () => {
    expect(imdbUrl(null)).toBe("");
    expect(imdbUrl(undefined)).toBe("");
    expect(imdbUrl("")).toBe("");
  });
});

describe("pickRandom", () => {
  it("returns undefined for an empty or missing list", () => {
    expect(pickRandom([])).toBeUndefined();
    expect(pickRandom(undefined)).toBeUndefined();
  });

  it("picks by the random value, including both ends of the list", () => {
    const items = ["a", "b", "c"];
    expect(pickRandom(items, () => 0)).toBe("a");
    expect(pickRandom(items, () => 0.5)).toBe("b");
    expect(pickRandom(items, () => 0.999)).toBe("c");
  });
});

describe("parseMoviePath", () => {
  it("reads the id from a movie path", () => {
    expect(parseMoviePath("/movie/603")).toBe(603);
    expect(parseMoviePath("/movie/603/")).toBe(603);
  });

  it("returns null for anything else", () => {
    expect(parseMoviePath("/")).toBeNull();
    expect(parseMoviePath("/movie")).toBeNull();
    expect(parseMoviePath("/movie/abc")).toBeNull();
    expect(parseMoviePath("/movie/12abc")).toBeNull();
    expect(parseMoviePath("/other/12")).toBeNull();
  });
});

describe("loadErrorMessage", () => {
  it("says not found for a 404", () => {
    expect(loadErrorMessage({ status: 404 })).toBe(ERROR_MESSAGES.NOT_FOUND);
  });

  it("says failed for other errors, including non-objects", () => {
    expect(loadErrorMessage({ status: 500 })).toBe(ERROR_MESSAGES.FAILED);
    expect(loadErrorMessage(new Error("network"))).toBe(ERROR_MESSAGES.FAILED);
    expect(loadErrorMessage(null)).toBe(ERROR_MESSAGES.FAILED);
  });
});

// Every filter set in the Filters tab, combined with every info-tab click.
// Expected values are spelled out here rather than computed with the code under
// test: a tab's value must replace the matching filter, every other filter must
// survive, and no parameter may be sent twice.
describe("filters combined with an info-tab click", () => {
  type Params = Record<string, string>;

  // Query parameters each active filter produces
  const filterCases: Record<string, { filters: object; params: Params }> = {
    country: {
      filters: { country: "US" },
      params: { with_origin_country: "US" },
    },
    genres: {
      filters: { genres: ["28", "12"] },
      params: { with_genres: "28,12" },
    },
    years: {
      filters: { yearFrom: 1990, yearTo: 1999 },
      params: {
        "primary_release_date.gte": "1990-01-01",
        "primary_release_date.lte": "1999-12-31",
      },
    },
    rating: {
      filters: { ratingFrom: 6, ratingTo: 8 },
      params: { "vote_average.gte": "6", "vote_average.lte": "8" },
    },
    "all filters": {
      filters: {
        country: "US",
        genres: ["28", "12"],
        yearFrom: 1990,
        yearTo: 1999,
        ratingFrom: 6,
        ratingTo: 8,
      },
      params: {
        with_origin_country: "US",
        with_genres: "28,12",
        "primary_release_date.gte": "1990-01-01",
        "primary_release_date.lte": "1999-12-31",
        "vote_average.gte": "6",
        "vote_average.lte": "8",
      },
    },
    "no filters": { filters: {}, params: {} },
  };

  // What each tab click searches for, and the parameters it should send
  const tabCases: Record<string, { overrides: object; params: Params }> = {
    country: {
      overrides: overridesForCountry("FR"),
      params: { with_origin_country: "FR" },
    },
    year: {
      overrides: overridesForYear(2005),
      params: {
        "primary_release_date.gte": "2005-01-01",
        "primary_release_date.lte": "2005-12-31",
      },
    },
    rating: {
      overrides: overridesForRating(7.5),
      params: { "vote_average.gte": "7.25", "vote_average.lte": "7.75" },
    },
    runtime: {
      overrides: overridesForRuntime(120),
      params: { "with_runtime.gte": "120", "with_runtime.lte": "120" },
    },
    genre: {
      overrides: overridesForGenre(18),
      params: { with_genres: "18" },
    },
  };

  const parse = (query: string) => [...new URLSearchParams(query)];

  for (const [filterName, filterCase] of Object.entries(filterCases)) {
    describe(`with ${filterName} set`, () => {
      for (const [tabName, tabCase] of Object.entries(tabCases)) {
        it(`${tabName} tab click replaces its own filter and keeps the rest`, () => {
          const query = buildSearchQuery(
            { ...DEFAULT_FILTER, ...filterCase.filters },
            tabCase.overrides,
          );
          const pairs = parse(query);

          // No parameter appears twice
          const keys = pairs.map(([key]) => key);
          expect(new Set(keys).size).toBe(keys.length);

          expect(Object.fromEntries(pairs)).toEqual({
            ...filterCase.params,
            ...tabCase.params,
          });
        });
      }
    });
  }

  it("ignores the filters when they are not in use", () => {
    for (const [tabName, tabCase] of Object.entries(tabCases)) {
      expect(
        Object.fromEntries(
          parse(buildSearchQuery(undefined, tabCase.overrides)),
        ),
        tabName,
      ).toEqual(tabCase.params);
    }
  });
});

describe("tab override helpers", () => {
  it("search the exact year or runtime", () => {
    expect(overridesForYear(1999)).toEqual({ yearFrom: 1999, yearTo: 1999 });
    expect(overridesForRuntime(90)).toEqual({
      runtimeFrom: 90,
      runtimeTo: 90,
    });
  });

  it("search a small range around a rating", () => {
    expect(overridesForRating(8)).toEqual({ ratingFrom: 7.75, ratingTo: 8.25 });
  });

  it("search one country or one genre", () => {
    expect(overridesForCountry("MK")).toEqual({ country: "MK" });
    expect(overridesForGenre(28)).toEqual({ genres: ["28"] });
  });
});

describe("noMatchMessage", () => {
  const withFilters = (patch: object) => ({ ...DEFAULT_FILTER, ...patch });

  it("names every limit the search had", () => {
    const message = noMatchMessage(
      withFilters({ country: "US", genres: ["28"], yearFrom: 1990 }),
    );
    expect(message).toContain("country + genre + years");
  });

  it("includes a tab's override, and counts a replaced filter once", () => {
    const filters = withFilters({ country: "US" });
    expect(noMatchMessage(filters, { country: "FR" })).toContain(
      "no matches for country;",
    );
    expect(
      noMatchMessage(filters, { runtimeFrom: 90, runtimeTo: 90 }),
    ).toContain("country + runtime");
  });

  it("ignores filters that are not in use or at their defaults", () => {
    expect(noMatchMessage(undefined, { ratingFrom: 7, ratingTo: 8 })).toContain(
      "no matches for rating;",
    );
    expect(noMatchMessage(DEFAULT_FILTER)).toBe(ERROR_MESSAGES.NO_MATCH);
    expect(noMatchMessage(undefined)).toBe(ERROR_MESSAGES.NO_MATCH);
  });
});
