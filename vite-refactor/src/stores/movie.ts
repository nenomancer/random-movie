import { writable } from "svelte/store";
import { DEFAULT_FILTER, DEFAULT_MOVIE, RELEASE_YEAR_MAX, RELEASE_YEAR_MIN } from "../lib/constants";
import { type Filters, type Movie } from "../lib/types";


export const currentMovie = writable<Movie>(DEFAULT_MOVIE);
export const useFilters = writable<boolean>(false);
export const currentFilters = writable<Filters>(DEFAULT_FILTER);
