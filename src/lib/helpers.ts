import { get } from "svelte/store";
import { activeTab, currentFilters, useFilters } from "../lib/stores";
import { DEFAULT_DROPDOWN_VALUE, DEFAULT_FILTER, FILTER_DEFAULTS, TAB_NAME } from "./constants";
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
        const clamped = clampYearValue(filters.yearFrom, FILTER_DEFAULTS.YEAR_MIN);
        const from = `${clamped}-01-01`
        queries.push(`primary_release_date.gte=${from}`)
    }

    if (filters.yearTo) {
        const clamped = clampYearValue(filters.yearTo, FILTER_DEFAULTS.YEAR_MAX);
        const to = `${clamped}-12-31`
        queries.push(`primary_release_date.lte=${to}`)
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
    if (isNaN(input)) {
        return fallback;
    }
    return Math.max(Math.min(input, FILTER_DEFAULTS.YEAR_MAX), FILTER_DEFAULTS.YEAR_MIN)
}

export function padNumber(number: number, size = 10) {
    const temp = "0000000000" + number;
    return temp.substring(temp.length - size);
}

export function formatRuntime(runtime: number) {
    return `${padNumber(Math.floor(runtime / 60), 2)}:${padNumber(runtime % 60, 2)}`;
}

export function showResultError() {
    console.error(
        "A result with the filtered parameters cannot be found! Try changing some of them, if the error persists, please reach out.",
    );
    activeTab.set(TAB_NAME.ERROR);
}

export function checkFilterEnable() {
    if (JSON.stringify(get(currentFilters)) == JSON.stringify(DEFAULT_FILTER)) {
        useFilters.set(false);
    } else {
        useFilters.set(true);
    }
}