import { get, derived } from "svelte/store";

import {
  currentHistory,
  allCountries,
  currentMovie,
  activeTab,
  currentFilters,
  useFilters,
} from "../lib/stores";
import {
  API,
  DEFAULT_MOVIE,
  DOCUMENT_TITLE,
  LOCAL_SESSION_HISTORY_KEY,
  TAB_NAME,
} from "./constants";
import { buildFilterQuery, showResultError } from "./helpers";
import type { Country, Person, Movie } from "./types";

function getMovieCredits(movieId: number) {
  fetch(`${API.MOVIE}/${movieId}/credits`, API.OPTIONS)
    .then((response) => response.json())
    .then((data) => {
      const directors = data.crew.filter(
        (person: Person) => person.job == "Director"
      );

      currentMovie.update((movie) => ({
        ...movie,
        directors: directors.map((director: Person) => ({
          name: director.name,
          id: director.id,
        })),
        actors: data.cast.slice(0, 5).map((actor: Person) => ({
          id: actor.id,
          name: actor.name,
        })),
      }));
    });
}

function getImdbUrl(movieId: number) {
  fetch(`${API.MOVIE}/${movieId}/external_ids`, API.OPTIONS)
    .then((response) => response.json())
    .then((data) => {
      currentMovie.update((movie) => ({
        ...movie,
        title: {
          imdb: `https://www.imdb.com/title/${data.imdb_id}/`,
          name: get(currentMovie).title.name,
        },
      }));
    })
    .catch((err) => console.error(err));
}

function addHistoryLog(movieId: number, movieTitle: string) {
  const maxHistory = 6;
  currentHistory.update((currentHistory) => {
    const updated = [...currentHistory, { id: movieId, name: movieTitle }];
    const uniqueHistory = Array.from(
      new Map(updated.map((item) => [item.id, item])).values()
    );

    if (uniqueHistory.length > maxHistory) {
      uniqueHistory.shift();
    }
    window.localStorage.setItem(
      LOCAL_SESSION_HISTORY_KEY,
      JSON.stringify(uniqueHistory)
    );
    return uniqueHistory;
  });
}

export const filterQueries = derived(
  [useFilters, currentFilters],
  ([$useFilters, $currentFilters]) => {
    if (!$useFilters) return "";

    return buildFilterQuery({
      country: $currentFilters.country || "",
      genres: $currentFilters.genres?.length
        ? [$currentFilters.genres.join(",")]
        : undefined,
      yearFrom: $currentFilters.yearFrom || undefined,
      yearTo: $currentFilters.yearTo || undefined,
      ratingFrom:
        $currentFilters.ratingFrom! > 0
          ? $currentFilters.ratingFrom
          : undefined,
      ratingTo:
        $currentFilters.ratingTo! < 10 ? $currentFilters.ratingTo : undefined,
    });
  }
);

export function fetchMovies(uiQueries = "", totalPages = 500) {
  activeTab.set(TAB_NAME.LOADING);
  // mainRef?.classList.add("loading-anim");

  let filterQueries = "";

  // if ($useFilters) {
  //     filterQueries = buildFilterQuery({
  //         country: `${$currentFilters.country ? $currentFilters.country : ""}`,
  //         genres: $currentFilters.genres?.length
  //             ? [$currentFilters.genres.join(",")]
  //             : undefined,
  //         yearFrom: $currentFilters.yearFrom
  //             ? $currentFilters.yearFrom
  //             : undefined,
  //         yearTo: $currentFilters.yearTo ? $currentFilters.yearTo : undefined,
  //         ratingFrom:
  //             $currentFilters.ratingFrom! > 0
  //                 ? $currentFilters.ratingFrom
  //                 : undefined,
  //         ratingTo:
  //             $currentFilters.ratingTo! < 10 ? $currentFilters.ratingTo : undefined,
  //     });
  // }

  const pageNumber = Math.ceil(Math.random() * totalPages);

  fetch(
    `${API.DISCOVER_MOVIE}?page=${pageNumber}${uiQueries}${filterQueries}`,
    API.OPTIONS
  )
    .then((response) => response.json())
    .then((response) => {
      const hasResults = response.results?.length > 0;
      const hasPages = response.total_pages > 0;
      const isLastPage = response.total_pages === totalPages;

      if (!hasResults && isLastPage) {
        return showResultError();
      }
      if (!hasResults && hasPages) {
        return fetchMovies(uiQueries, Math.min(500, response.total_pages));
      }
      if (hasResults) {
        return getRandomMovie(response.results);
      }

      return showResultError();
    });
}

function getRandomMovie(data: Array<Movie>) {
  // console.log("ALL LOADING ANIMATINOS HERE");
  // mainRef?.classList?.add("loading-anim");
  activeTab.set(TAB_NAME.LOADING);

  const randomIndex = Math.floor(Math.random() * data.length);

  if (!data) return;
  for (const [index, movie] of data.entries()) {
    if (index === randomIndex) {
      getMovie(movie.id);
      break;
    }
  }
}

async function getMovie(movieId: number) {
  currentMovie.set(DEFAULT_MOVIE);
  await fetch(`${API.MOVIE}/${movieId}`, API.OPTIONS)
    .then((response) => response.json())
    .then((data) => {
      if (data.backdrop_path) {
        currentMovie.update((movie) => ({
          ...movie,
          backdrop: `${API.POSTER}/${data.backdrop_path}`,
        }));
      }
      if (data.poster_path) {
        currentMovie.update((movie) => ({
          ...movie,
          poster: `${API.POSTER}/${data.poster_path}`,
        }));
      }

      function generateTitle(
        originalTitle: string,
        englishTitle: string
      ): string {
        if (data.original_language !== "en" && originalTitle != englishTitle) {
          return `${originalTitle} (${englishTitle})`;
        }

        return originalTitle;
      }

      const countries = get(allCountries);

      currentMovie.update((movie) => ({
        ...movie,
        title: {
          imdb: "",
          name: generateTitle(data.original_title, data.title),
        },
        year: data.release_date
          ? new Date(data.release_date).getFullYear()
          : undefined,

        rating:
          data.vote_average > 0
            ? Math.round(data.vote_average * 10) / 10
            : undefined,
        runtime: data.runtime > 0 ? data.runtime : undefined,
        country: countries.find(
          (country) => country.code === data.origin_country[0]
        )!,
        genres: data.genres,
        plot: data.overview,
      }));

      const newUrl = `/movie/${movieId}`;
      if (window.location.pathname !== newUrl) {
        history.pushState({}, "", newUrl);
      }
      getMovieCredits(movieId);
      getImdbUrl(movieId);
      setTimeout(() => addHistoryLog(movieId, data.title), 1500);
    })
    .catch((err) => {
      showResultError();
    })
    .finally(() => {
      // TUKA NEKOE TAJMERCHE OFFSETCHE DEMEK SE LOADIRA PODOLGO ZA ANIMACIJATA DA ZAVRSHI SO DISKOT

      setTimeout(() => {
        // mainRef?.classList?.remove("loading-anim");
      }, 500);
      setTimeout(() => {
        // console.log("Delayed action");
        activeTab.set(TAB_NAME.INFO);
      }, 1000);
    });
}

export async function fetchMovie(movieId: number) {
  const response = await fetch(`${API.MOVIE}/${movieId}`, API.OPTIONS);
  if (!response.ok) throw new Error("Failed to fetch movie");
  return response.json();
}

export function normalizeMovie(data: any) {
  function generateTitle(original: string, english: string) {
    if (data.original_language !== "en" && original !== english) {
      return `${original} (${english})`;
    }
    return original;
  }

  const countries = get(allCountries);
  return {
    backdrop: data.backdrop_path
      ? `${API.POSTER}/${data.backdrop_path}`
      : undefined,
    poster: data.poster_path ? `${API.POSTER}/${data.poster_path}` : undefined,
    title: {
      imdb: "",
      name: generateTitle(data.original_title, data.title),
    },
    year: data.release_date
      ? new Date(data.release_date).getFullYear()
      : undefined,
    rating:
      data.vote_average > 0
        ? Math.round(data.vote_average * 10) / 10
        : undefined,
    runtime: data.runtime > 0 ? data.runtime : undefined,
    country: countries.find((c) => c.code === data.origin_country?.[0]),
    genres: data.genres,
    plot: data.overview,
  };
}
