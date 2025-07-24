export interface Movie {
    id: number;
    title: Title;
    genres: Genre[];
    directors: Person[];
    actors: Person[];
    country: Country;
    year: number | undefined;
    runtime?: number;
    rating?: number;
    plot?: string;
    poster?: string;
}
export interface Title {
    imdb?: string,
    name: string,
}

export interface ReleaseDate {
    exact: number,
    year: number
}
export interface Genre {
    id: number;
    name: string;
}

export interface Person {
    id: number;
    name: string;
    job: string;
}

export interface Country {
    code: string;
    name: string;
    native: string;
}

export interface HistoryLog {
    id: number;
    name: string;
}

export interface Filters {
    country?: string,
    genres?: string[],
    yearFrom?: number,
    yearTo?: number,
    ratingFrom?: number,
    ratingTo?: number
    runtimeFrom?: number,
    runtimeTo?: number,
}
