export interface Movie {
    id: number;
    title: Title;
    genres: Genre[];
    directors: Person[];
    actors: Person[];
    country: Country;
    date: ReleaseDate;
    runtime: number;
    rating: number;
    plot: string;
    poster: string;
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
    id: string;
    name: string;
    job: string;
}

export interface Country {
    code: string;
    name: string;
}