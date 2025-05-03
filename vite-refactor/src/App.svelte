<script lang="ts">
  import "./styles/variables.css";
  import Monitor from "./components/Monitor.svelte";
  import Screen from "./components/Screen.svelte";
  import Tabs from "./components/Tabs.svelte";
  import Tab from "./components/Tab.svelte";
  import InfoRow from "./components/InfoRow.svelte";

  import { Monitor1Screens, Monitor2Screens } from "./constants/screens";
  import { Monitor1Tabs, Monitor2Tabs } from "./constants/tabs";
  import TabContent from "./components/TabContent.svelte";
  import { API } from "./lib/constants";
  import { get, writable } from "svelte/store";
  import type { Country, HistoryLog, Movie, Person } from "./lib/types";
  import Button from "./components/Button.svelte";

  let monitor1_active_screen = Monitor1Screens.Screen1;
  let monitor2_active_screen = Monitor2Screens.Screen1;

  export const defaultMovie: Movie = {
    id: -1,
    title: { name: "" },
    genres: [],
    directors: [],
    actors: [],
    date: { exact: 0, year: 0 },
    country: { code: "", name: "" },
    rating: 0,
    runtime: 0,
    plot: "",
    poster: "",
  };

  export const currentMovie = writable<Movie>(defaultMovie);

  const storedHistoryKey = "movieHistory";
  const storedHistory = localStorage.getItem(storedHistoryKey);
  export const currentHistory = writable<HistoryLog[]>(
    storedHistory ? JSON.parse(storedHistory) : [],
  );
  let allCountries: Country[] = [];

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
        storedHistoryKey,
        JSON.stringify(uniqueHistory),
      );
      return uniqueHistory;
    });
  }

  function fetchMovies(queries = "", totalPages = 500) {
    let _queries = queries;
    const pageNumber = Math.floor(Math.random() * totalPages);

    fetch(`${API.DISCOVER_MOVIE}?page=${pageNumber}${_queries}`, API.OPTIONS)
      .then((response) => response.json())
      .then((response) => {
        if (response.results?.length === 0) {
          fetchMovies("", Math.min(500, response.total_pages));
        } else {
          getRandomMovie(response.results);
        }
        // successResponse.classList.add("active");
      })
      .catch((err) => {
        console.error(err);
        alert("NO MOVIES WITH THOSE PARAMETERS, PLEASE ADJUST YOUR FILTERS.");
      });
  }

  export function getRandomMovie(data: Array<Movie>, maxIndex = 20) {
    const randomIndex = Math.floor(Math.random() * maxIndex);

    data.forEach((movie: Movie, index: number) => {
      if (index === randomIndex) {
        getMovie(movie.id);
      }
    });
  }

  async function getMovie(movieId: number) {
    fetch(`${API.MOVIE}/${movieId}`, API.OPTIONS)
      .then((response) => response.json())
      .then((data) => {
        console.log("MOVIE: ");
        console.log(data);

        if (data.poster_path) {
          currentMovie.update((movie) => ({
            ...movie,
            poster: `${API.POSTER}/${data.poster_path}`,
          }));
        } else {
          // poster.classList.add("no-image");
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
          date: {
            exact: data.release_date,
            year: new Date(data.release_date).getFullYear(),
          },
          rating: data.vote_average,
          runtime: data.runtime,
          country: allCountries.find(
            (country) => country.code === data.origin_country[0],
          )!,
          genres: data.genres,
          plot: data.overview,
        }));

        getMovieCredits(movieId);
        getImdbUrl(movieId);
        addHistoryLog(movieId, data.title);

        return;
        // getMovieGenres(data);
        const originalTitle = data.original_title;
        const englishTitle = data.title;
        const id = data.id;

        // date.innerText = data.release_date.split("-")[0];
        // temp.className = "button-span";
        // temp.classList.add("link");

        // titleUrl.innerText = originalTitle;
        // temp.appendChild(titleUrl);
        // titleEl.appendChild(temp);

        // if (data.original_language !== "en" && originalTitle != englishTitle) {
        //   titleUrl.innerText += " (" + englishTitle + ")";
        // }

        // movieIdDisplay.setAttribute("data-movie-id", id);
        // movieIdDisplay.classList.add("loading");

        // if (data.poster_path) {
        //   poster.src = "https://image.tmdb.org/t/p/w500" + data.poster_path;
        // } else {
        //   poster.classList.add("no-image");
        // }

        // const found = allCountries.find(
        //   (el) => el.iso_3166_1 == data.origin_country[0],
        // );
        const runtimeMinutes = data.runtime;
        const rate = Math.round(data.vote_average * 10) / 10;
        // popularityEl.innerText = data.popularity;
        // votesEl.innerText = data.vote_count;
        // const normalized = data.vote_average / 10;
        // const deg = normalized * 180;
        // if (data.revenue === 0) {
        //   revenueEl.innerText = padNumber("0");
        // } else {
        //   revenueEl.innerText = padNumber(data.revenue);
        // }
        // if (data.budget === 0) {
        //   budgetEl.innerText = padNumber("0");
        // } else {
        //   budgetEl.innerText = padNumber(data.budget);
        // }
        // runtimeEl.innerText = data.runtime;
        // profitEl.innerText = padNumber(data.revenue - data.budget);

        // bindHoverTooltip(budgetEl);

        // plotContent.innerText = data.overview;
        // locationEl.innerText = found?.native_name;
        // countries.innerText = found?.native_name;
        // rating.innerText = rate.toFixed(1);
        // runtime.innerText = `${padNumber(Math.floor(runtimeMinutes / 60), 2)}:${runtimeMinutes % 60
        //   }`;

        // if (data.overview === "") {
        //   plotContent.innerText =
        //     "No plot found for this movie. You're gonna have to watch it";
        // }
        // if (data.runtime === 0) {
        //   subtitle.removeChild(runtime);
        // }

        // const maxHistory = 7;
        // const exisiting = history.find((element) => element.id == data.id);
        // if (history.length > maxHistory) {
        //   history.shift();
        // }
        // if (!exisiting) {
        //   history.push({
        //     id: data.id,
        //     title: data.title,
        //   });
        // }
      })
      .catch((err) => {
        // pendingResponse.classList.remove("active");
        // errorResponse.classList.add("active");
      });
    // .finally((data) => {
    //   // pendingResponse.classList.remove("active");
    //   // successResponse.classList.add("active");

    //   // hideLoadingScreens();
    //   // return;
    // });
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

  function generateCountries() {
    return fetch(API.COUNTRIES, API.OPTIONS)
      .then((response) => response.json())
      .then((response) => {
        // const value = document.querySelector(".value");
        // value.addEventListener("click", (e) => {
        //   countriesFilterList.parentElement.classList.toggle("open");
        //   genreFilterContainer.classList.remove("open");
        // });

        // function toggleSelection(temp) {
        //   temp.classList.toggle("selected");
        //   const selected = Array.from(
        //     document.querySelectorAll(".countries .content .option.selected")
        //   );

        //   selected.forEach((item) => {
        //     if (item !== temp) {
        //       item.classList.remove("selected");
        //     }
        //   });

        //   if (selected.length == 0) {
        //     value.innerText = "Any";
        //     value.setAttribute("data-filter-country", "");
        //   } else {
        //     value.innerText = temp.innerText;
        //     value.setAttribute(
        //       "data-filter-country",
        //       temp.getAttribute("data-country-id")
        //     );
        //   }
        // }

        allCountries = response.map((country: any) => ({
          code: country.iso_3166_1,
          name: country.english_name,
        }));

        allCountries.forEach((country: Country) => {
          // const temp = document.createElement("span");
          // temp.className = "option button-span link";
          // temp.addEventListener("click", (e) => {
          //   toggleSelection(temp);
          //   countriesFilterList.parentElement.classList.remove("open");
          // });
          // temp.innerText = country.english_name;
          // temp.setAttribute("data-country-id", country.iso_3166_1);
          // temp.value = country.iso_3166_1;
          // countriesFilterList.appendChild(temp);
          // console.log("country: ", country);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  export function getMoviesByActor(actorId: number) {
    fetch(
      `${API.PERSON}/${actorId}?append_to_response=movie_credits`,
      API.OPTIONS,
    )
      .then((response) => response.json())
      .then((response) => {
        const temp = response.movie_credits.cast;
        return getRandomMovie(temp, temp.length);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  function getMoviesByReleaseDate(year: number) {
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;
    fetchMovies(
      `&primary_release_date.gte=${start}&primary_release_date.lte=${end}`,
    );
  }

  function getMoviesByRuntime(runtime: number) {
    console.log("RUNTIME: ", runtime);
    fetchMovies(`&with_runtime.lte=${runtime}&with_runtime.gte=${runtime}`);
  }

  // 100% helper
  function padNumber(number: number, size = 10) {
    const temp = "0000000000" + number;
    return temp.substring(temp.length - size);
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
        return getRandomMovie(temp, temp.length);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getMoviesByRating(rating: number) {
    const lower = Math.floor(rating);
    const higher = Math.ceil(rating);
    fetchMovies(
      `&vote_average.gte=${lower}?vote_average.lte=${higher}?vote_counte.gte=100`,
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
    // fetch(`${API.DISCOVER_MOVIE}?with_genres=${genreId}`, API.OPTIONS).then
    fetchMovies(`&with_genres=${genreId}`);
  }

  function formatRuntime(runtime: number) {
    return `${padNumber(Math.floor(runtime / 60), 2)}:${padNumber(runtime % 60, 2)}`;
  }

  generateCountries();

  // initApp();

  function initApp() {
    const history = get(currentHistory);
    if (history.length) {
      const lastLog = history[history.length - 1];
      getMovie(lastLog.id);
    } else {
    }
  }
  fetchMovies();

  // currentHistory.subscribe((history) => {
  //   if (history.length) {
  //     getMovie(history[history.length - 1].id);
  //   } else {
  //     fetchMovies();
  //   }
  //   unsubscribe();
  // });
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
            <Button
              label={$currentMovie.date.year.toString()}
              onClick={() => getMoviesByReleaseDate($currentMovie.date.year)}
              ariaLabel={`Release year: ${$currentMovie.date.year}`}
              description={`This movie's release year. Click to find another movie released in ${$currentMovie.date.year}.`}
            />

            <!-- Country  -->
            <Button
              label={$currentMovie.country.name}
              onClick={() => getMoviesByCountry($currentMovie.country.code)}
              ariaLabel={`Country: ${$currentMovie.country.name}.`}
              description={`This movie's country of origin. Click to find another movie from ${$currentMovie.country.name}`}
            />

            <!-- Rating  -->
            <Button
              label={$currentMovie.rating.toString()}
              onClick={() => getMoviesByRating($currentMovie.rating)}
              ariaLabel={`IMDB rating: ${$currentMovie.rating}.`}
              description={`This movie is rated ${$currentMovie.rating}. Click to find another movie with a similar rating.`}
            />

            <!-- Runtime  -->
            <Button
              label={formatRuntime($currentMovie.runtime)}
              onClick={() => getMoviesByRuntime($currentMovie.runtime)}
              ariaLabel={`Runtime: ${padNumber(Math.floor($currentMovie.runtime / 60), 2)} hours and ${padNumber($currentMovie.runtime % 60, 2)} minutes`}
              description={`Runtime: ${formatRuntime($currentMovie.runtime)}. Click to find another movie with a similar runtime.`}
            />
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
            <p>{$currentMovie.plot}</p>
          </section>
        </TabContent>

        <TabContent name={"Filters"}>
          <div>
            <div class="header">
              <span>Country</span>
              <span class="value">Any</span>
            </div>
            <div class="options">
              {#each allCountries as country}
                <span>{country.name}</span>
              {/each}
            </div>
          </div>
        </TabContent>
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
      <img style="width: 50%" src={$currentMovie.poster} alt="" />
    </Screen>
    <Screen name={Monitor2Screens.Screen2} activeScreen={monitor2_active_screen}
      >About Us</Screen
    >
  </Monitor>
  <button on:click={() => fetchMovies()}>CLICK ME</button>
  <div>
    {#each $currentHistory as log}
      <button on:click={() => getMovie(log.id)}>{log.name}</button>
    {/each}
  </div>
</main>

<!-- 240px -->
<!-- 480px -->

<style global>
  @import "./styles/variables.css";

  .options {
    display: flex;
    flex-direction: column;
    display: none;
  }
</style>
