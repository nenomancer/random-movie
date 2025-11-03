import { writable } from "svelte/store";
import { DEFAULT_COUNTRY, DEFAULT_FILTER, DEFAULT_MOVIE, LOCAL_SESSION_HISTORY_KEY, TAB_NAME } from "../lib/constants";
import type { Country, Filters, Movie, HistoryLog } from "../lib/types";


export const currentMovie = writable<Movie>(DEFAULT_MOVIE);
export const useFilters = writable<boolean>(false);
export const currentFilters = writable<Filters>(DEFAULT_FILTER);
export const allCountries = writable<Array<Country>>([DEFAULT_COUNTRY]);
export const resetFiltersSignal = writable<boolean>(false);

const storedHistory = localStorage.getItem(LOCAL_SESSION_HISTORY_KEY);
export const currentHistory = writable<HistoryLog[]>(
    storedHistory ? JSON.parse(storedHistory) : [],
);


export const openDropdown = writable<string | null>(null)
export const activeTab = writable<string>(TAB_NAME.INFO);
