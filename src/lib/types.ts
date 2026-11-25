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
  backdrop?: string;
}
export interface Title {
  imdb?: string;
  name: string;
}

export interface ReleaseDate {
  exact: number;
  year: number;
}
export interface Genre {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  job?: string;
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
  country?: string;
  genres?: string[];
  actor?: string;
  director?: string;
  yearFrom?: number;
  yearTo?: number;
  ratingFrom?: number;
  ratingTo?: number;
  runtimeFrom?: number;
  runtimeTo?: number;
}

// The parts of TMDB's responses we read (not the full API shapes)
export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  release_date?: string;
  vote_average: number;
  runtime: number;
  origin_country?: string[];
  genres: Genre[];
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
}

export interface TmdbCredits {
  cast: Person[];
  crew: Person[];
}

export interface TmdbCountry {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}
