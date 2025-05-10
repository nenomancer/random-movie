import { writable } from "svelte/store";
import { DEFAULT_MOVIE } from "../lib/constants";
import { type Filters, type Movie } from "../lib/types";


export const currentMovie = writable<Movie>(DEFAULT_MOVIE);
export const useFilters = writable<boolean>(false);
export const currentFilters = writable<Filters>();
