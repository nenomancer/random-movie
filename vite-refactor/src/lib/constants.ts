
import type { Country, Filters, Movie } from "./types";

export const LOCAL_SESSION_HISTORY_KEY = "movieHistory";
export const DEFAULT_DROPDOWN_VALUE = "Any";
export const DOCUMENT_TITLE = "Nenomancer's Random Movie Generator"

export const FILTER_DEFAULTS = {
    DROPDOWN: "Any",
    YEAR_MIN: 1878,
    YEAR_MAX: new Date().getFullYear()
}

export const TAB_NAME = {
    INFO: 'Info',
    FILTERS: 'Filters',
    ABOUT: 'About',
    LOADING: 'Loading',
    ERROR: 'Error',
}

export const API = {
    OPTIONS: {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODg3OTU1MzhmOGVmMGUxMTU5Y2E3MWJlNTM4YmU4NCIsIm5iZiI6MTcyNjUyMjM0OS4xNTU2MzEsInN1YiI6IjY2ZTVlZjYzZTgyMTFlY2QyMmIwM2I2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kZ--6xTSfsDgHDDlDqhVvxXFiLSdDCmwYXdThKJQH54",
        },
    },
    COUNTRIES: "https://api.themoviedb.org/3/configuration/countries",
    GENRES: "https://api.themoviedb.org/3/genre/movie/list",
    PERSON: "https://api.themoviedb.org/3/person",
    MOVIE: "https://api.themoviedb.org/3/movie",
    DISCOVER_MOVIE: "https://api.themoviedb.org/3/discover/movie",
    POSTER: "https://image.tmdb.org/t/p/w500",
}

export const DEFAULT_MOVIE: Movie = {
    id: -1,
    title: { name: "" },
    genres: [],
    directors: [],
    actors: [],
    year: undefined,
    country: { code: "", name: "", native: '' },
    rating: undefined,
    runtime: undefined,
    plot: "",
    poster: "",
};

export const DEFAULT_FILTER: Filters = {
    country: "Any",
    genres: [],
    yearFrom: FILTER_DEFAULTS.YEAR_MIN,
    yearTo: FILTER_DEFAULTS.YEAR_MAX,
    ratingFrom: 0,
    ratingTo: 10,
    runtimeFrom: 0,
    runtimeTo: 500,
}

export const DEFAULT_COUNTRY: Country = {
    code: "", name: DEFAULT_DROPDOWN_VALUE, native: ""
}