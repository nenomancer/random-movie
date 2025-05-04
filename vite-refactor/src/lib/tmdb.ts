// import { API } from "./constants";
// import type { Writable } from "svelte/store";
// import type { Movie } from "./types";
// export function getMoviesByActor(actorId: string) {
//     fetch(
//         `${API.PERSON}/${actorId}?append_to_response=movie_credits`,
//         API.OPTIONS,
//     )
//         .then((response) => response.json())
//         .then((response) => {
//             const temp = response.movie_credits.cast;
//             return getRandomMovie(temp, temp.length);
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// }


// export function fetchMovies(movieStore: Writable<Movie>, queries = "", totalPages = 500) {
//     let _queries = queries;
//     const pageNumber = Math.floor(Math.random() * totalPages);

//     fetch(`${API.DISCOVER_MOVIE}?page=${pageNumber}${_queries}`, API.OPTIONS)
//         .then((response) => response.json())
//         .then((response) => {
//             if (response.results?.length === 0) {
//                 fetchMovies("", Math.min(500, response.total_pages));
//             } else {
//                 getRandomMovie(response.results);
//             }
//             // successResponse.classList.add("active");
//         })
//         .catch((err) => {
//             console.error(err);
//             alert("NO MOVIES WITH THOSE PARAMETERS, PLEASE ADJUST YOUR FILTERS.");
//         });
// }

// export function getRandomMovie(data: Array<Movie>, maxIndex = 20) {
//     const randomIndex = Math.floor(Math.random() * maxIndex);

//     data.forEach((movie: Movie, index: number) => {
//         if (index === randomIndex) {
//             getMovie(movie.id);
//         }
//     });
// }

// async function getMovie(movieStore: Writable<Movie>, movieId: number) {
//     fetch(`${API.MOVIE}/${movieId}`, API.OPTIONS)
//         .then((response) => response.json())
//         .then((data) => {
//             console.log("MOVIE: ");
//             console.log(data);

//             if (data.poster_path) {
//                 movieStore.update((movie: Movie) => ({
//                     ...movie,
//                     poster: `${API.POSTER}/${data.poster_path}`,
//                 }));
//             } else {
//                 // poster.classList.add("no-image");
//             }

//             function generateTitle(
//                 originalTitle: string,
//                 englishTitle: string,
//             ): string {
//                 if (
//                     data.original_language !== "en" &&
//                     originalTitle != englishTitle
//                 ) {
//                     return `${originalTitle} (${englishTitle})`;
//                 }

//                 return originalTitle;
//             }

//             movieStore.update((movie: Movie) => ({
//                 ...movie,
//                 title: {
//                     imdb: "",
//                     name: generateTitle(data.original_title, data.title),
//                 },
//                 date: {
//                     exact: data.release_date,
//                     year: new Date(data.release_date).getFullYear(),
//                 },
//                 rating: data.vote_average,
//                 runtime: data.runtime,
//                 country: allCountries.find(
//                     (country) => country.code === data.origin_country[0],
//                 )!,
//                 genres: data.genres,
//                 plot: data.overview,
//             }));

//             getMovieCredits(movieId);
//             getImdbUrl(movieId);

//             return;
//             // getMovieGenres(data);
//             const originalTitle = data.original_title;
//             const englishTitle = data.title;
//             const id = data.id;

//             // date.innerText = data.release_date.split("-")[0];
//             // temp.className = "button-span";
//             // temp.classList.add("link");

//             // titleUrl.innerText = originalTitle;
//             // temp.appendChild(titleUrl);
//             // titleEl.appendChild(temp);

//             // if (data.original_language !== "en" && originalTitle != englishTitle) {
//             //   titleUrl.innerText += " (" + englishTitle + ")";
//             // }

//             // movieIdDisplay.setAttribute("data-movie-id", id);
//             // movieIdDisplay.classList.add("loading");

//             // if (data.poster_path) {
//             //   poster.src = "https://image.tmdb.org/t/p/w500" + data.poster_path;
//             // } else {
//             //   poster.classList.add("no-image");
//             // }

//             // const found = allCountries.find(
//             //   (el) => el.iso_3166_1 == data.origin_country[0],
//             // );
//             const runtimeMinutes = data.runtime;
//             const rate = Math.round(data.vote_average * 10) / 10;
//             // popularityEl.innerText = data.popularity;
//             // votesEl.innerText = data.vote_count;
//             // const normalized = data.vote_average / 10;
//             // const deg = normalized * 180;
//             // if (data.revenue === 0) {
//             //   revenueEl.innerText = padNumber("0");
//             // } else {
//             //   revenueEl.innerText = padNumber(data.revenue);
//             // }
//             // if (data.budget === 0) {
//             //   budgetEl.innerText = padNumber("0");
//             // } else {
//             //   budgetEl.innerText = padNumber(data.budget);
//             // }
//             // runtimeEl.innerText = data.runtime;
//             // profitEl.innerText = padNumber(data.revenue - data.budget);

//             // bindHoverTooltip(budgetEl);

//             // plotContent.innerText = data.overview;
//             // locationEl.innerText = found?.native_name;
//             // countries.innerText = found?.native_name;
//             // rating.innerText = rate.toFixed(1);
//             // runtime.innerText = `${padNumber(Math.floor(runtimeMinutes / 60), 2)}:${runtimeMinutes % 60
//             //   }`;

//             // if (data.overview === "") {
//             //   plotContent.innerText =
//             //     "No plot found for this movie. You're gonna have to watch it";
//             // }
//             // if (data.runtime === 0) {
//             //   subtitle.removeChild(runtime);
//             // }

//             // const maxHistory = 7;
//             // const exisiting = history.find((element) => element.id == data.id);
//             // if (history.length > maxHistory) {
//             //   history.shift();
//             // }
//             // if (!exisiting) {
//             //   history.push({
//             //     id: data.id,
//             //     title: data.title,
//             //   });
//             // }
//         })
//         .catch((err) => {
//             // pendingResponse.classList.remove("active");
//             // errorResponse.classList.add("active");
//         });
//     // .finally((data) => {
//     //   // pendingResponse.classList.remove("active");
//     //   // successResponse.classList.add("active");

//     //   // hideLoadingScreens();
//     //   // return;
//     // });
// }
