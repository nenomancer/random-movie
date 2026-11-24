import { get } from "svelte/store";
import { activeTab, currentFilters, errorMessage, resetFiltersSignal, useFilters } from "../lib/stores";
import { API, DEFAULT_DROPDOWN_VALUE, DEFAULT_FILTER, ERROR_MESSAGES, FILTER_DEFAULTS, TAB_NAME } from "./constants";
import type { Filters } from "./types";

export function buildFilterQuery(filters: Filters) {

    const queries: string[] = [];

    if (filters.country && filters.country != DEFAULT_DROPDOWN_VALUE) {
        queries.push(`with_origin_country=${filters.country}`);
    }

    if (filters.genres?.length) {
        queries.push(`with_genres=${filters.genres.join(',')}`);
    }

    if (filters.yearFrom) {
        const clamped = clampYearValue(filters.yearFrom);
        const from = `${clamped}-01-01`
        queries.push(`primary_release_date.gte=${from}`)
    }

    if (filters.yearTo) {
        const clamped = clampYearValue(filters.yearTo);
        const to = `${clamped}-12-31`
        queries.push(`primary_release_date.lte=${to}`)
    }

    if (filters.ratingFrom) {
        queries.push(`vote_average.gte=${filters.ratingFrom}`)
    }

    if (filters.ratingTo) {
        queries.push(`vote_average.lte=${filters.ratingTo}`)
    }

    if (filters.runtimeFrom) {
        queries.push(`with_runtime.gte=${filters.runtimeFrom}`)
    }

    if (filters.runtimeTo) {
        queries.push(`with_runtime.lte=${filters.runtimeTo}`)
    }

    return queries.length ? '&' + queries.join('&') : '';
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
export function resolveYearInput(raw: string, fallback: number, commit = false): number | null {
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
    return Math.max(Math.min(input, FILTER_DEFAULTS.YEAR_MAX), FILTER_DEFAULTS.YEAR_MIN)
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

/**
 * Turns the current filter state into a query string, sending only values the
 * user actually changed. Defaults (the full year range, ratings 0-10, "Any"
 * country) are left out: TMDB's date bounds also drop titles with no or future
 * release dates, which would quietly shrink the pool.
 */
export function buildActiveFilterQuery(filters: Filters) {
    return buildFilterQuery({
        country: filters.country,
        genres: filters.genres,
        yearFrom: filters.yearFrom !== DEFAULT_FILTER.yearFrom ? filters.yearFrom : undefined,
        yearTo: filters.yearTo !== DEFAULT_FILTER.yearTo ? filters.yearTo : undefined,
        ratingFrom: filters.ratingFrom !== DEFAULT_FILTER.ratingFrom ? filters.ratingFrom : undefined,
        ratingTo: filters.ratingTo !== DEFAULT_FILTER.ratingTo ? filters.ratingTo : undefined,
    });
}

// JSON.stringify with object keys sorted, so the same values compare equal
// whatever order the keys were added in.
function stableStringify(value: unknown) {
    return JSON.stringify(value, (_key, v) =>
        v && typeof v === "object" && !Array.isArray(v)
            ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
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
