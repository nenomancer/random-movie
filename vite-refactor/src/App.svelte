<script lang="ts">
  import Monitor from "./components/layout/Monitor.svelte";
  import Screen from "./components/layout/Screen.svelte";
  import TabContent from "./components/tabs/TabContent.svelte";
  import ControlPanel from "./components/ui/ControlPanel.svelte";
  import NoteContainer from "./components/ui/NoteContainer.svelte";

  import InfoTitle from "./components/info/InfoTitle.svelte";
  import ExtraInfo from "./components/info/ExtraInfo.svelte";
  import InfoRows from "./components/info/InfoRows.svelte";
  import InfoRow from "./components/info/InfoRow.svelte";
  import InfoPlot from "./components/info/InfoPlot.svelte";
  import InfoPoster from "./components/info/InfoPoster.svelte";

  import FilterYears from "./components/filters/FilterYears.svelte";
  import FilterGenres from "./components/filters/FilterGenres.svelte";
  import FilterRating from "./components/filters/FilterRating.svelte";
  import FilterCountries from "./components/filters/FilterCountries.svelte";

  import { buildFilterQuery, showResultError } from "./lib/helpers";
  import type { Country, Genre, Movie, Person } from "./lib/types";
  import {
    API,
    DEFAULT_MOVIE,
    DOCUMENT_TITLE,
    LOCAL_SESSION_HISTORY_KEY,
  } from "./lib/constants";

  import { currentFilters, currentMovie, useFilters } from "./stores/movie";
  import { currentHistory } from "./stores/history";
  import { activeTab } from "./stores/ui";

  import { onDestroy, onMount } from "svelte";
  import "./styles/variables.css";

  let allCountries: Country[] = [];
  let allGenres: Genre[] = [];

  let mainRef: HTMLElement;

  function handleGlobalKeyboard(event: KeyboardEvent) {
    if (event.key === "Enter" && document.activeElement === document.body) {
      fetchMovies();
    }
    if (event.key === "Escape" && document.activeElement !== document.body) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }
  const handlePopState = () => {
    const params = window.location.pathname.split("/");
    if (params[1] === "movie" && params[2]) {
      getMovie(Number(params[2]));
    }
  };

  onMount(() => {
    document.addEventListener("keydown", handleGlobalKeyboard);

    window.addEventListener("popstate", handlePopState);
  });

  onDestroy(() => {
    document.removeEventListener("keydown", handleGlobalKeyboard);
    window.removeEventListener("popstate", handlePopState);
  });

  /**
   * Logs movie to history without duplicates (local storage)
   * @param movieId used to write and retrieve movie from history
   * @param movieTitle used for display
   */
  function addHistoryLog(movieId: number, movieTitle: string) {
    const maxHistory = 6;
    currentHistory.update((currentHistory) => {
      const updated = [...currentHistory, { id: movieId, name: movieTitle }];
      const uniqueHistory = Array.from(
        new Map(updated.map((item) => [item.id, item])).values(),
      );

      if (uniqueHistory.length > maxHistory) {
        uniqueHistory.shift();
      }
      window.localStorage.setItem(
        LOCAL_SESSION_HISTORY_KEY,
        JSON.stringify(uniqueHistory),
      );
      return uniqueHistory;
    });
  }

  function fetchMovies(uiQueries = "", totalPages = 500) {
    activeTab.set("Loading");
    mainRef.classList.add("loading-anim");

    let filterQueries = "";

    if ($useFilters) {
      filterQueries = buildFilterQuery({
        country: `${$currentFilters.country ? $currentFilters.country : ""}`,
        genres: $currentFilters.genres?.length
          ? [$currentFilters.genres.join(",")]
          : undefined,
        yearFrom: $currentFilters.yearFrom
          ? $currentFilters.yearFrom
          : undefined,
        yearTo: $currentFilters.yearTo ? $currentFilters.yearTo : undefined,
        ratingFrom:
          $currentFilters.ratingFrom! > 0
            ? $currentFilters.ratingFrom
            : undefined,
        ratingTo:
          $currentFilters.ratingTo! < 10 ? $currentFilters.ratingTo : undefined,
      });
    }

    const pageNumber = Math.ceil(Math.random() * totalPages);

    fetch(
      `${API.DISCOVER_MOVIE}?page=${pageNumber}${uiQueries}${filterQueries}`,
      API.OPTIONS,
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
    console.log("ALL LOADING ANIMATINOS HERE");

    activeTab.set("Loading");
    mainRef.classList.add("loading-anim");

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
    fetch(`${API.MOVIE}/${movieId}`, API.OPTIONS)
      .then((response) => response.json())
      .then((data) => {
        if (data.poster_path) {
          currentMovie.update((movie) => ({
            ...movie,
            poster: `${API.POSTER}/${data.poster_path}`,
          }));
        }

        function generateTitle(
          originalTitle: string,
          englishTitle: string,
        ): string {
          if (
            data.original_language !== "en" &&
            originalTitle != englishTitle
          ) {
            return `${originalTitle} (${englishTitle})`;
          }

          return originalTitle;
        }

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
          country: allCountries.find(
            (country) => country.code === data.origin_country[0],
          )!,
          genres: data.genres,
          plot: data.overview,
        }));

        document.title = `${$currentMovie.title.name} | ${DOCUMENT_TITLE}`;

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
        mainRef.classList.remove("loading-anim");

        setTimeout(() => {
          console.log("Delayed action");
          activeTab.set("Info");
        }, 1000);
      });
  }

  function getMovieCredits(movieId: number) {
    fetch(`${API.MOVIE}/${movieId}/credits`, API.OPTIONS)
      .then((response) => response.json())
      .then((data) => {
        const directors = data.crew.filter(
          (person: Person) => person.job == "Director",
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
            name: $currentMovie.title.name,
          },
        }));
      })
      .catch((err) => console.error(err));
  }

  function generateGenres() {
    return fetch(API.GENRES, API.OPTIONS)
      .then((response) => response.json())
      .then((response) => {
        allGenres = response.genres;
        return;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function generateCountries() {
    return fetch(API.COUNTRIES, API.OPTIONS)
      .then((response) => response.json())
      .then((response) => {
        allCountries = response.map((country: any) => ({
          code: country.iso_3166_1,
          name: country.english_name,
          native: country.native_name,
        }));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getMoviesByActor(actorId: number) {
    console.log("HERE??");
    // resetFilter();
    fetch(
      `${API.PERSON}/${actorId}?append_to_response=movie_credits`,
      API.OPTIONS,
    )
      .then((response) => response.json())
      .then((response) => {
        const temp = response.movie_credits.cast;
        return getRandomMovie(temp);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getMoviesByDirector(directorId: number) {
    fetch(
      `${API.PERSON}/${directorId}?append_to_response=movie_credits`,
      API.OPTIONS,
    )
      .then((response) => response.json())
      .then((response) => {
        const temp = response.movie_credits.crew.filter(
          (credit: any) => credit.job === "Director",
        );
        return getRandomMovie(temp);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  export function getMoviesByReleaseDate(year: number) {
    fetchMovies(buildFilterQuery({ yearFrom: year, yearTo: year }));
  }

  export function getMoviesByRuntime(runtime: number) {
    fetchMovies(buildFilterQuery({ runtimeFrom: runtime, runtimeTo: runtime }));
  }

  // Fuzzy search, votes are not too reliable and the API allows only averages
  export function getMoviesByRating(rating: number) {
    const range = 0.25;
    fetchMovies(
      buildFilterQuery({
        ratingFrom: rating - range,
        ratingTo: rating + range,
      }),
    );
  }

  export function getMoviesByCountry(countryCode: string) {
    fetch(
      `${API.DISCOVER_MOVIE}?with_origin_country=${countryCode}`,
      API.OPTIONS,
    )
      .then((response) => response.json())
      .then((response) => {
        getRandomMovie(response.results);
      });
  }

  function getMoviesByGenre(genreId: number) {
    fetchMovies(`&with_genres=${genreId}`);
  }

  function initApp() {
    const path = window.location.pathname;
    const match = path.match(/^\/movie\/(\d+)$/);

    if (match) {
      const movieId = Number(match[1]);
      return getMovie(movieId);
    } else {
      fetchMovies();
    }
  }
  generateCountries();
  generateGenres();
  initApp();
</script>

<main bind:this={mainRef}>
  <Monitor classes={["main"]}>
    <Screen>
      <TabContent name={"Info"}>
        <div class="kurac-border">
          <InfoTitle />
          <ExtraInfo
            {getMoviesByCountry}
            {getMoviesByRating}
            {getMoviesByReleaseDate}
            {getMoviesByRuntime}
          />
        </div>
        <InfoRows>
          <InfoRow
            label={"Genre"}
            title={"GNR"}
            items={$currentMovie.genres}
            onClick={getMoviesByGenre}
            getDescription={(name: string) =>
              `Genre: ${name}. Click to find another ${name.toLowerCase()} movie.`}
          />
          <InfoRow
            label={"Director"}
            title={"DIR"}
            items={$currentMovie.directors}
            onClick={getMoviesByDirector}
            getDescription={(name: string) =>
              `Director: ${name}. Click to find another movie directed by ${name}`}
          />

          <InfoRow
            label={"Actor"}
            title={"ACT"}
            items={$currentMovie.actors}
            onClick={getMoviesByActor}
            getDescription={(name: string) =>
              `Actor: ${name}. Click to find another movie that features ${name}`}
          />
        </InfoRows>

        <InfoPlot />
      </TabContent>

      <TabContent name={"Filters"}>
        <FilterCountries
          id="country"
          label={"Country"}
          options={allCountries}
          onChange={(countryCode) =>
            currentFilters.update((filters) => ({
              ...filters,
              country: countryCode.code,
            }))}
        />
        <FilterGenres
          id="genre"
          label={"Genre"}
          options={allGenres}
          onChange={(genreCodes) =>
            currentFilters.update((filters) => ({
              ...filters,
              genres: genreCodes,
            }))}
        />
        <FilterYears />
        <FilterRating
          onChange={(fromValue, toValue) =>
            currentFilters.update((filters) => ({
              ...filters,
              ratingFrom: fromValue,
              ratingTo: toValue,
            }))}
        />
      </TabContent>
      <TabContent name="Loading">Loading....</TabContent>
      <TabContent name="Error">Error!!!</TabContent>
      <TabContent name="About">About moi</TabContent>
    </Screen>
  </Monitor>
  <Monitor classes={["poster"]}>
    <Screen>
      <TabContent name="Info">
        <InfoPoster />
      </TabContent>
      <TabContent name="Loading">Loading...</TabContent>
      <TabContent name="Error">Error!!!</TabContent>
      <TabContent name="About">ABOUT MEE!!!!</TabContent>
    </Screen>
  </Monitor>
  <div class="extras-disk" style="grid-area: disk; background: grey;">
    <img style="width: 40%" src={$currentMovie.poster} alt="" />
  </div>
  <ControlPanel {fetchMovies} />
  <NoteContainer {getMovie} />
  <div style="grid-area: extra; background: grey;">
    <h4>country: {$currentFilters?.country}</h4>
    <h4>genres: {$currentFilters?.genres}</h4>
  </div>
</main>

<!-- 240px -->
<!-- 480px -->

<style global>
  @import "./styles/variables.css";
</style>
