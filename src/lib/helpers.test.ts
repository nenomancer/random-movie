import { afterEach, describe, expect, it, vi } from "vitest";
import { get } from "svelte/store";
import { API, ERROR_MESSAGES, FILTER_DEFAULTS, TAB_NAME } from "./constants";
import {
  buildFilterQuery,
  fetchJson,
  formatRuntime,
  padNumber,
  showResultError,
} from "./helpers";
import { activeTab, errorMessage } from "./stores";

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
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }),
    );

    await expect(fetchJson(`${API.MOVIE}/0`)).rejects.toThrow("404");
  });

  it("exposes the HTTP status on the error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }),
    );

    await expect(fetchJson(`${API.MOVIE}/0`)).rejects.toMatchObject({
      status: 404,
    });
  });

  it("does not parse the body of a failed response", async () => {
    const json = vi.fn();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, json }));

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
