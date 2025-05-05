import { DEFAULT_DROPDOWN_VALUE, RELEASE_YEAR_MAX, RELEASE_YEAR_MIN } from "./constants";
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
        const clamped = clampYearValue(filters.yearFrom, RELEASE_YEAR_MIN);
        const from = `${clamped}-01-01`
        queries.push(`primary_release_date.gte=${from}`)
    }

    if (filters.yearTo) {
        const clamped = clampYearValue(filters.yearTo, RELEASE_YEAR_MAX);
        const to = `${clamped}-12-31`
        queries.push(`primary_release_date.gte=${to}`)
    }

    if (filters.ratingFrom) {
        queries.push(`vote_average.gte=${filters.ratingFrom}`)
    }

    if (filters.ratingTo) {
        queries.push(`vote_average.lte=${filters.ratingTo}`)
    }

    return queries.length ? '&' + queries.join('&') : '';
}

function clampYearValue(input: number, fallback: number) {
    if (isNaN(input)) { // Mozhda ne mora
        return fallback;
    }
    return Math.min(Math.max(input, RELEASE_YEAR_MAX), RELEASE_YEAR_MIN)
}

export function padNumber(number: number, size = 10) {
    const temp = "0000000000" + number;
    return temp.substring(temp.length - size);
}

export function formatRuntime(runtime: number) {
    return `${padNumber(Math.floor(runtime / 60), 2)}:${padNumber(runtime % 60, 2)}`;
}