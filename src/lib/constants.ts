
import type { Country, Filters, Movie } from "./types";

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



// API endpoints. TMDB requests go through our own proxy (/api/tmdb/*) which
// adds the API key server-side (netlify/functions/tmdb.mjs in prod, the Vite
// dev proxy locally), so no secret ends up in the client bundle.
const TMDB_PROXY = "/api/tmdb";

export const API = {
    OPTIONS: {
        method: "GET",
        headers: {
            accept: "application/json",
        },
    },
    COUNTRIES: `${TMDB_PROXY}/configuration/countries`,
    GENRES: `${TMDB_PROXY}/genre/movie/list`,
    PERSON: `${TMDB_PROXY}/person`,
    MOVIE: `${TMDB_PROXY}/movie`,
    DISCOVER_MOVIE: `${TMDB_PROXY}/discover/movie`,
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

// Messages for the error / empty-state screen. Written in normal case; the
// .sys-msg class (app.scss) uppercases them and adds the terminal prompt.
export const ERROR_MESSAGES = {
    // The search worked but nothing matched the chosen filters
    NO_MATCH: "Archive scan complete: no matches; recalibrate filters and scan again",
    // A lookup (cast, director, country) came back with nothing to pick from
    NO_RELATED: "No cross-references in archive; try a different signal",
    // Network error, TMDB down, rate limit...
    FAILED: "Uplink failure: archive unreachable; retry transmission",
    // Direct link to a movie id that doesn't exist (HTTP 404)
    NOT_FOUND: "File not in archive; it may have been corrupted or never existed",
}

// Typewriter effect for the error screen: milliseconds per character
export const TYPING_MS_PER_CHAR = 25;
