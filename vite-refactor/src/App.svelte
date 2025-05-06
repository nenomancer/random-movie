<script lang="ts">
  import "./styles/variables.css";
  import Monitor from "./components/Monitor.svelte";
  import Screen from "./components/Screen.svelte";
  import Tabs from "./components/Tabs.svelte";
  import Tab from "./components/Tab.svelte";
  import InfoRow from "./components/InfoRow.svelte";

  import { Monitor1Screens, Monitor2Screens } from "./constants/screens";
  import TabContent from "./components/TabContent.svelte";
  import {
    API,
    DEFAULT_MOVIE,
    DOCUMENT_TITLE,
    LOCAL_SESSION_HISTORY_KEY,
  } from "./lib/constants";
  import type { Country, Genre, HistoryLog, Movie, Person } from "./lib/types";
  import Button from "./components/Button.svelte";
  import FilterCountries from "./components/FilterCountries.svelte";
  import {
    buildFilterQuery,
    formatRuntime,
    padNumber,
    showResultError,
  } from "./lib/helpers";
  import FilterGenres from "./components/FilterGenres.svelte";
  import FilterYear from "./components/FilterYear.svelte";
  import FilterRating from "./components/FilterRating.svelte";
  import { currentMovie, useFilters } from "./stores/movie";
  import { currentHistory } from "./stores/history";
  import { activeTab } from "./stores/ui";
  import FilterEnable from "./components/FilterEnable.svelte";

  let monitor1_active_screen = Monitor1Screens.Screen1;
  let monitor2_active_screen = Monitor2Screens.Screen1;

  let filterCountryCode: string;
  let filterGenreIds: number[];
  let filterYearFrom: number;
  let filterYearTo: number;
  let filterRatingFrom: number;
  let filterRatingTo: number;

  let filterCountryRef: FilterCountries;
  let filterGenresRef: FilterGenres;

  let allCountries: Country[] = [];
  let allGenres: Genre[] = [];

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
  function fetchMovies(queries = "", totalPages = 500) {
    activeTab.set("Loading");

    let _queries = "";

    if ($useFilters) {
      _queries = buildFilterQuery({
        country: `${filterCountryCode ? filterCountryCode : ""}`,
        genres: filterGenreIds?.length
          ? [...filterGenreIds.join(",")]
          : undefined,
        yearFrom: filterYearFrom ? filterYearFrom : undefined,
        yearTo: filterYearTo ? filterYearTo : undefined,
        ratingFrom: filterRatingFrom > 0 ? filterRatingFrom : undefined,
        ratingTo: filterRatingTo < 10 ? filterRatingTo : undefined,
      });
    }

    const pageNumber = Math.ceil(Math.random() * totalPages);

    fetch(`${API.DISCOVER_MOVIE}?page=${pageNumber}${_queries}`, API.OPTIONS)
      .then((response) => response.json())
      .then((response) => {
        const hasResults = response.results?.length > 0;
        const hasPages = response.total_pages > 0;
        const isLastPage = response.total_pages === totalPages;

        if (!hasResults && isLastPage) {
          return showResultError();
        }
        if (!hasResults && hasPages) {
          fetchMovies(_queries, Math.min(500, response.total_pages));
        }
        if (hasResults) {
          return getRandomMovie(response.results);
        }

        return showResultError();
      });
  }

  function getRandomMovie(data: Array<Movie>) {
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

        const newUrl = `/movie/${movieId}`;
        document.title = `${$currentMovie.title.name} | ${DOCUMENT_TITLE}`;
        history.pushState({}, "", newUrl);

        getMovieCredits(movieId);
        getImdbUrl(movieId);
        addHistoryLog(movieId, data.title);
      })
      .catch((err) => {
        // pendingResponse.classList.remove("active");
        // errorResponse.classList.add("active");
        activeTab.set("Error");
      })
      .finally(() => {
        activeTab.set("Info");

        // pendingResponse.classList.remove("active");
        // successResponse.classList.add("active");

        // hideLoadingScreens();
        // return;
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
        }));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getMoviesByActor(actorId: number) {
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

  function getMoviesByReleaseDate(year: number) {
    fetchMovies(buildFilterQuery({ yearFrom: year, yearTo: year }));
  }

  function getMoviesByRuntime(runtime: number) {
    fetchMovies(buildFilterQuery({ runtimeFrom: runtime, runtimeTo: runtime }));
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

  // Fuzzy search, votes are not too reliable and the API allows only averages
  function getMoviesByRating(rating: number) {
    const range = 0.25;
    fetchMovies(
      buildFilterQuery({
        ratingFrom: rating - range,
        ratingTo: rating + range,
      }),
    );
  }

  function getMoviesByCountry(countryCode: string) {
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

<main>
  <Monitor>
    <Screen
      name={Monitor1Screens.Screen1}
      activeScreen={monitor1_active_screen}
    >
      <Tabs>
        <Tab name={"Info"} />
        <Tab name="Filters" />

        <TabContent name={"Info"}>
          <section aria-labelledby="movie-title">
            <h1 id="movie-title">
              <span class="label">Title:</span>
              <a
                href={$currentMovie.title.imdb}
                data-info={``}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open IMDb page for ${
                  $currentMovie.title.name
                } in a new tab`}
              >
                {$currentMovie.title.name}
              </a>
            </h1>
          </section>

          <section aria-label="Extra information">
            <!-- Release date  -->
            {#if $currentMovie.year}
              <Button
                label={$currentMovie.year.toString()}
                onClick={() => getMoviesByReleaseDate($currentMovie.year!)}
                ariaLabel={`Release year: ${$currentMovie.year}`}
                description={`This movie's release year. Click to find another movie released in ${$currentMovie.year}.`}
              />
            {/if}

            <!-- Country  -->
            {#if $currentMovie.country}
              <Button
                label={$currentMovie.country.name}
                onClick={() => getMoviesByCountry($currentMovie.country.code)}
                ariaLabel={`Country: ${$currentMovie.country.name}.`}
                description={`This movie's country of origin. Click to find another movie from ${$currentMovie.country.name}`}
              />
            {/if}

            <!-- Rating  -->
            {#if $currentMovie.rating}
              <Button
                label={$currentMovie.rating.toString()}
                onClick={() => getMoviesByRating($currentMovie.rating!)}
                ariaLabel={`IMDB rating: ${$currentMovie.rating}.`}
                description={`This movie is rated ${$currentMovie.rating}. Click to find another movie with a similar rating.`}
              />
            {/if}

            <!-- Runtime  -->
            {#if $currentMovie.runtime}
              <Button
                label={formatRuntime($currentMovie.runtime)}
                onClick={() => getMoviesByRuntime($currentMovie.runtime!)}
                ariaLabel={`Runtime: ${padNumber(Math.floor($currentMovie.runtime / 60), 2)} hours and ${padNumber($currentMovie.runtime % 60, 2)} minutes`}
                description={`Runtime: ${formatRuntime($currentMovie.runtime)}. Click to find another movie with a similar runtime.`}
              />
            {/if}
          </section>

          <InfoRow
            label={"Genre"}
            title={"GNR"}
            items={$currentMovie.genres}
            onClick={getMoviesByGenre}
            getDescription={(name) =>
              `Genre: ${name}. Click to find another ${name.toLowerCase()} movie.`}
          />
          <InfoRow
            label={"Director"}
            title={"DIR"}
            items={$currentMovie.directors}
            onClick={getMoviesByDirector}
            getDescription={(name) =>
              `Director: ${name}. Click to find another movie directed by ${name}`}
          />

          <InfoRow
            label={"Actor"}
            title={"ACT"}
            items={$currentMovie.actors}
            onClick={getMoviesByActor}
            getDescription={(name) =>
              `Actor: ${name}. Click to find another movie that features ${name}`}
          />

          <section aria-label="Plot">
            <h2>PLT:</h2>
            <p>
              {$currentMovie.plot
                ? $currentMovie.plot
                : "[Plot data encrypted]"}
            </p>
          </section>
        </TabContent>

        <TabContent name={"Filters"}>
          <FilterCountries
            id="country"
            label={"Country"}
            options={allCountries}
            onChange={(countryCode) => (filterCountryCode = countryCode.code)}
            bind:this={filterCountryRef}
          />
          <FilterGenres
            id="genre"
            label={"Genre"}
            options={allGenres}
            onChange={(genreCodes) => (filterGenreIds = genreCodes)}
            bind:this={filterGenresRef}
          />
          <section>
            <label for="year-from">Year</label>
            <div>
              <FilterYear
                placeholder={"From"}
                onChange={(yearValue) => (filterYearFrom = yearValue)}
              />
              <FilterYear
                placeholder={"To"}
                onChange={(yearValue) => (filterYearTo = yearValue)}
              />
            </div>
          </section>
          <FilterRating
            onChange={(fromValue, toValue) => {
              (filterRatingFrom = fromValue), (filterRatingTo = toValue);
            }}
          />
        </TabContent>
        <TabContent name="Loading">Loading....</TabContent>
        <TabContent name="Error">Error!!!</TabContent>
      </Tabs>
    </Screen>
    <Screen name={Monitor1Screens.Screen2} activeScreen={monitor1_active_screen}
      >About Us Screen</Screen
    >
  </Monitor>
  <Monitor>
    Monitor 2:
    <button on:click={() => (monitor2_active_screen = Monitor2Screens.Screen2)}
      >Show screen 2</button
    >
    <Screen name={Monitor2Screens.Screen1} activeScreen={monitor2_active_screen}
      >Tabs: Poster Screen / Advanced Filter
      <TabContent name="Info">
        {#if $currentMovie.poster}
          <img
            style="width: 50%"
            src={$currentMovie.poster}
            alt={`Poster for the movie ${$currentMovie.title}`}
          />
        {/if}
        {#if !$currentMovie.poster}
          <p>Image data corrupted.</p>
        {/if}
      </TabContent>
      <TabContent name="Loading">Loading...</TabContent>
      <TabContent name="Error">Error!!!</TabContent>
    </Screen>
    <Screen name={Monitor2Screens.Screen2} activeScreen={monitor2_active_screen}
      >About Us</Screen
    >
  </Monitor>
  <div>
    <button on:click={() => fetchMovies()}>CLICK ME</button>

    <FilterEnable />
    <div>
      {#each $currentHistory as log}
        <button on:click={() => getMovie(log.id)}>{log.name}</button>
      {/each}
    </div>
  </div>
  <h4>code is: {filterCountryCode}</h4>
</main>

<!-- 240px -->
<!-- 480px -->

<style global>
  @import "./styles/variables.css";
</style>
