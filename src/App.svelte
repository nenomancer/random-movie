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
    directorsOf,
    fetchJson,
    imdbUrl,
    loadErrorMessage,
    noMatchMessage,
    mapCountries,
    mapCredits,
    mapMovieDetails,
    overridesForCountry,
    overridesForGenre,
    overridesForRating,
    overridesForRuntime,
    overridesForYear,
    parseMoviePath,
    pickRandom,
    showResultError,
  } from "./lib/helpers";
  import type { Country, Filters, Genre } from "./lib/types";
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
    const movieId = parseMoviePath(window.location.pathname);
    if (movieId !== null) {
      getMovie(movieId);
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

  // Shared failure path for anything that loads a movie: log and show the
  // error tab.
  function handleLoadError(err: unknown) {
    console.error(err);
    showResultError(loadErrorMessage(err));
  }

  // `overrides` (a tab's country, year, ...) replace the matching filter for
  // this search only; every other active filter still applies.
  function fetchMovies(overrides: Filters = {}, totalPages = 500) {
    activeTab.set(TAB_NAME.LOADING);

    const activeFilters = $useFilters ? $currentFilters : undefined;
    const filterQueries = buildSearchQuery(activeFilters, overrides);

    const pageNumber = Math.ceil(Math.random() * totalPages);

    fetchJson(`${API.DISCOVER_MOVIE}?page=${pageNumber}${filterQueries}`)
      .then((response) => {
        const hasResults = response.results?.length > 0;
        const hasPages = response.total_pages > 0;
        const isLastPage = response.total_pages === totalPages;

        const noMatch = () =>
          showResultError(noMatchMessage(activeFilters, overrides));

        if (!hasResults && isLastPage) {
          return noMatch();
        }
        if (!hasResults && hasPages) {
          return fetchMovies(overrides, Math.min(500, response.total_pages));
        }
        if (hasResults) {
          return getRandomMovie(response.results);
        }

        return noMatch();
      })
      .catch(handleLoadError);
  }

  function getRandomMovie(data: Array<{ id: number }>) {
    activeTab.set(TAB_NAME.LOADING);

    const movie = pickRandom(data);
    if (!movie) return showResultError(ERROR_MESSAGES.NO_RELATED);

    getMovie(movie.id);
  }

  async function getMovie(movieId: number) {
    latestMovieId = movieId;
    let failed = false;
    currentMovie.set(DEFAULT_MOVIE);
    await fetchJson(`${API.MOVIE}/${movieId}`)
      .then((data) => {
        if (movieId !== latestMovieId) return;

        currentMovie.update((movie) => ({
          ...movie,
          ...mapMovieDetails(data, allCountries),
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

        // Keep the loading screen up a moment so it doesn't just flash
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

        currentMovie.update((movie) => ({ ...movie, ...mapCredits(data) }));
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
            imdb: imdbUrl(data.imdb_id),
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
        allCountries = mapCountries(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Actor and director clicks pick from that person's whole filmography
  // (/person/:id) on purpose: the active filters do not apply to them, unlike
  // the year, country, rating, runtime and genre clicks (see fetchMovies).
  function getMoviesByActor(actorId: number) {
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
        return getRandomMovie(
          directorsOf<{ id: number; job?: string }>(
            response.movie_credits.crew,
          ),
        );
      })
      .catch(handleLoadError);
  }

  export function getMoviesByReleaseDate(year: number) {
    fetchMovies(overridesForYear(year));
  }

  export function getMoviesByRuntime(runtime: number) {
    fetchMovies(overridesForRuntime(runtime));
  }

  export function getMoviesByRating(rating: number) {
    fetchMovies(overridesForRating(rating));
  }

  export function getMoviesByCountry(countryCode: string) {
    fetchMovies(overridesForCountry(countryCode));
  }

  function getMoviesByGenre(genreId: number) {
    fetchMovies(overridesForGenre(genreId));
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

<main>
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
  <ControlPanel {fetchMovies} />
  <Monitor classes={["history"]}>
    <Screen>
      <History {getMovie} />
    </Screen>
  </Monitor>
  <Monitor classes={["tooltip"]}>
    <!-- <Screen>
      <div">Tooltip in progress</div>
    </Screen> -->
  </Monitor>
  <!-- <Extras /> -->
</main>
