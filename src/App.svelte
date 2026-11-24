<script lang="ts">
  import Monitor from "./components/layout/Monitor.svelte";
  import Screen from "./components/layout/Screen.svelte";
  import TabContent from "./components/tabs/TabContent.svelte";
  import ControlPanel from "./components/ui/ControlPanel.svelte";
  import History from "./components/ui/History.svelte";

  import InfoTitle from "./components/info/InfoTitle.svelte";
  import ExtraInfo from "./components/info/ExtraInfo.svelte";
  import InfoRows from "./components/info/InfoRows.svelte";
  import InfoRow from "./components/info/InfoRow.svelte";
  import InfoPlot from "./components/info/InfoPlot.svelte";
  import InfoPoster from "./components/info/InfoPoster.svelte";

  import FilterYears from "./components/Filters/FilterYears.svelte";
  import FilterGenres from "./components/Filters/FilterGenres.svelte";
  import FilterRating from "./components/Filters/FilterRating.svelte";
  import FilterCountries from "./components/Filters/FilterCountries.svelte";

  import { addHistoryLog } from "./lib/useHistory";

  import {
    buildSearchQuery,
    fetchJson,
    showResultError,
  } from "./lib/helpers";
  import type { Country, Filters, Genre, Movie, Person } from "./lib/types";
  import {
    API,
    DEFAULT_FILTER,
    DEFAULT_MOVIE,
    DOCUMENT_TITLE,
    ERROR_MESSAGES,
    LOCAL_SESSION_HISTORY_KEY,
    TAB_NAME,
  } from "./lib/constants";

  import {
    currentHistory,
    currentFilters,
    currentMovie,
    useFilters,
    activeTab,
    errorMessage,
  } from "./lib/stores";

  import { onDestroy, onMount } from "svelte";
  import AboutContent from "./components/info/AboutContent.svelte";
  import TypedMessage from "./components/ui/TypedMessage.svelte";
  import FilterContent from "./components/Filters/FilterContent.svelte";

  let allCountries: Country[] = [];
  let allGenres: Genre[] = [];

  let mainRef: HTMLElement;
  // Id of the movie the user most recently asked for. Responses for any other
  // id are stale (user clicked again before they arrived) and must be ignored.
  let latestMovieId: number | null = null;

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

  // Shared failure path for anything that loads a movie: log, show the error
  // tab and stop the loading animation.
  function handleLoadError(err: unknown) {
    console.error(err);
    const status = (err as { status?: number } | null)?.status;
    showResultError(
      status === 404 ? ERROR_MESSAGES.NOT_FOUND : ERROR_MESSAGES.FAILED
    );
    mainRef?.classList.remove("loading-anim");
  }

  // `overrides` (a tab's country, year, ...) replace the matching filter for
  // this search only; every other active filter still applies.
  function fetchMovies(overrides: Filters = {}, totalPages = 500) {
    activeTab.set(TAB_NAME.LOADING);
    mainRef?.classList.add("loading-anim");

    const filterQueries = buildSearchQuery(
      $useFilters ? $currentFilters : undefined,
      overrides
    );

    const pageNumber = Math.ceil(Math.random() * totalPages);

    fetchJson(
      `${API.DISCOVER_MOVIE}?page=${pageNumber}${filterQueries}`
    )
      .then((response) => {
        const hasResults = response.results?.length > 0;
        const hasPages = response.total_pages > 0;
        const isLastPage = response.total_pages === totalPages;

        if (!hasResults && isLastPage) {
          return showResultError();
        }
        if (!hasResults && hasPages) {
          return fetchMovies(overrides, Math.min(500, response.total_pages));
        }
        if (hasResults) {
          return getRandomMovie(response.results);
        }

        return showResultError();
      })
      .catch(handleLoadError);
  }

  function getRandomMovie(data: Array<Movie>) {
    mainRef?.classList?.add("loading-anim");
    activeTab.set(TAB_NAME.LOADING);

    if (!data?.length) return showResultError(ERROR_MESSAGES.NO_RELATED);

    const randomIndex = Math.floor(Math.random() * data.length);

    for (const [index, movie] of data.entries()) {
      if (index === randomIndex) {
        getMovie(movie.id);
        break;
      }
    }
  }

  async function getMovie(movieId: number) {
    latestMovieId = movieId;
    let failed = false;
    currentMovie.set(DEFAULT_MOVIE);
    await fetchJson(`${API.MOVIE}/${movieId}`)
      .then((data) => {
        if (movieId !== latestMovieId) return;

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
          id: movieId,
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
            (country) => country.code === data.origin_country[0]
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
        addHistoryLog(movieId, data.title);
        // setTimeout(() =>, 1500);
      })
      .catch((err) => {
        if (movieId !== latestMovieId) return; // superseded, not our error
        failed = true;
        handleLoadError(err);
      })
      .finally(() => {
        // A newer request owns the screen now, don't touch it.
        if (movieId !== latestMovieId) return;

        // TUKA NEKOE TAJMERCHE OFFSETCHE DEMEK SE LOADIRA PODOLGO ZA ANIMACIJATA DA ZAVRSHI SO DISKOT

        setTimeout(() => {
          mainRef?.classList?.remove("loading-anim");
        }, 500);
        setTimeout(() => {
          // Never replace the error screen, or a newer movie's loading screen
          if (!failed && movieId === latestMovieId) {
            activeTab.set(TAB_NAME.INFO);
          }
        }, 1000);
      });
  }

  function getMovieCredits(movieId: number) {
    fetchJson(`${API.MOVIE}/${movieId}/credits`)
      .then((data) => {
        if (movieId !== latestMovieId) return;

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
      })
      // Credits are optional extras; log but keep showing the movie
      .catch((err) => console.error(err));
  }

  function getImdbUrl(movieId: number) {
    fetchJson(`${API.MOVIE}/${movieId}/external_ids`)
      .then((data) => {
        if (movieId !== latestMovieId) return;

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

  async function generateGenres() {
    return fetchJson(API.GENRES)
      .then((response) => {
        allGenres = response.genres;
        return;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function generateCountries() {
    return fetchJson(API.COUNTRIES)
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
    // resetFilter();
    fetchJson(`${API.PERSON}/${actorId}?append_to_response=movie_credits`)
      .then((response) => {
        const temp = response.movie_credits.cast;
        return getRandomMovie(temp);
      })
      .catch(handleLoadError);
  }

  function getMoviesByDirector(directorId: number) {
    fetchJson(`${API.PERSON}/${directorId}?append_to_response=movie_credits`)
      .then((response) => {
        const temp = response.movie_credits.crew.filter(
          (credit: any) => credit.job === "Director"
        );
        return getRandomMovie(temp);
      })
      .catch(handleLoadError);
  }

  export function getMoviesByReleaseDate(year: number) {
    fetchMovies({ yearFrom: year, yearTo: year });
  }

  export function getMoviesByRuntime(runtime: number) {
    fetchMovies({ runtimeFrom: runtime, runtimeTo: runtime });
  }

  // Fuzzy search, votes are not too reliable and the API allows only averages
  export function getMoviesByRating(rating: number) {
    const range = 0.25;
    fetchMovies({ ratingFrom: rating - range, ratingTo: rating + range });
  }

  export function getMoviesByCountry(countryCode: string) {
    fetchMovies({ country: countryCode });
  }

  function getMoviesByGenre(genreId: number) {
    fetchMovies({ genres: [String(genreId)] });
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
      <TabContent name={TAB_NAME.INFO}>
        <div class="custom-border">
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

      <TabContent name={TAB_NAME.FILTERS}>
        <FilterCountries
          id="country"
          label={"CTR"}
          name="Country"
          options={allCountries}
          onChange={(countryCode) =>
            currentFilters.update((filters) => ({
              ...filters,
              country: countryCode.code,
            }))}
        />
        <FilterGenres
          id="genre"
          label={"GNR"}
          name="Genre"
          options={allGenres}
          onChange={(genreCodes) =>
            currentFilters.update((filters) => ({
              ...filters,
              genres: genreCodes,
            }))}
        />
        <FilterYears label={"YRS"} name="Release year" />
        <FilterRating
          label={"RTG"}
          name="Rating"
          onChange={(fromValue, toValue) =>
            currentFilters.update((filters) => ({
              ...filters,
              ratingFrom: fromValue,
              ratingTo: toValue,
            }))}
        />
      </TabContent>
      <TabContent name={TAB_NAME.LOADING}>
        {#if $activeTab === TAB_NAME.LOADING}
          <TypedMessage text="Accessing archive..." mode="status" />
        {/if}
      </TabContent>
      <TabContent name={TAB_NAME.ERROR}>
        <!-- Only mounted while visible, so it types out afresh on every error -->
        {#if $activeTab === TAB_NAME.ERROR}
          <TypedMessage text={$errorMessage} />
        {/if}
      </TabContent>
      <TabContent name={TAB_NAME.ABOUT}>
        <AboutContent />
      </TabContent>
    </Screen>
  </Monitor>
  <Monitor classes={["poster"]}>
    <Screen>
      <TabContent name={TAB_NAME.INFO}>
        <InfoPoster />
      </TabContent>
      <!-- Decorative: the info monitor already announces loading / errors -->
      <TabContent name={TAB_NAME.LOADING}>
        {#if $activeTab === TAB_NAME.LOADING}
          <TypedMessage text="Receiving signal..." mode="decorative" />
        {/if}
      </TabContent>
      <TabContent name={TAB_NAME.ERROR}>
        {#if $activeTab === TAB_NAME.ERROR}
          <TypedMessage text="Signal lost" mode="decorative" />
        {/if}
      </TabContent>

      <TabContent name={TAB_NAME.ABOUT}>
        <AboutContent isMain={false} />
      </TabContent>
      <TabContent name={TAB_NAME.FILTERS}>
        <FilterContent />
      </TabContent>
    </Screen>
  </Monitor>
  <!-- <Disk /> -->
  <ControlPanel {fetchMovies} />
  <Monitor classes={["history"]}>
    <Screen>
      <History {getMovie} />
    </Screen>
  </Monitor>
  <Monitor classes={["tooltip"]} padding={1.5}>
    <!-- <Screen>
      <div">Tooltip in progress</div>
    </Screen> -->
  </Monitor>
  <!-- <Extras /> -->
</main>
