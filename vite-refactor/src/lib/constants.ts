
import type { Country, Filters, Movie, Person } from "./types";

// Document's title
export const DOCUMENT_TITLE = "Nenomancer's Random Movie Generator"
// Cookie key for recent history
export const LOCAL_SESSION_HISTORY_KEY = "movieHistory";
// A default value for all dropdowns
export const DEFAULT_DROPDOWN_VALUE = "Any";

export const CLASSNAMES = {
    LOAD_IN: 'anim-load-in',
    LOAD_OUT: 'anim-load-out'
}



// API endpoints
export const API = {
    OPTIONS: {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
        },
    },
    COUNTRIES: "https://api.themoviedb.org/3/configuration/countries",
    GENRES: "https://api.themoviedb.org/3/genre/movie/list",
    PERSON: "https://api.themoviedb.org/3/person",
    MOVIE: "https://api.themoviedb.org/3/movie",
    DISCOVER_MOVIE: "https://api.themoviedb.org/3/discover/movie",
    POSTER: "https://image.tmdb.org/t/p/w500",
}


// Default values for the Filters tab
export const FILTER_DEFAULTS = {
    DROPDOWN: "Any",
    YEAR_MIN: 1878,
    YEAR_MAX: new Date().getFullYear(),
    RATING_MIN: 0,
    RATING_MAX: 10,
}

// Tab names
export const TAB_NAME = {
    INFO: 'Info',
    FILTERS: 'Filters',
    ABOUT: 'About',
    LOADING: 'Loading',
    ERROR: 'Error',
}

// Default movie values
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
    backdrop: "",
};

// Default filter values
export const DEFAULT_FILTER: Filters = {
    country: "Any",
    genres: [],
    actor: '',
    director: '',
    yearFrom: FILTER_DEFAULTS.YEAR_MIN,
    yearTo: FILTER_DEFAULTS.YEAR_MAX,
    ratingFrom: 0,
    ratingTo: 10,
    runtimeFrom: 0,
    runtimeTo: 500,
}

export const DEFAULT_COUNTRY: Country = {
    code: "Any", name: DEFAULT_DROPDOWN_VALUE, native: "Any"
}

export const DEFAULT_PERSON: Person = {
    name: '', id: 0, job: '',
}