const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODg3OTU1MzhmOGVmMGUxMTU5Y2E3MWJlNTM4YmU4NCIsIm5iZiI6MTcyNjUyMjM0OS4xNTU2MzEsInN1YiI6IjY2ZTVlZjYzZTgyMTFlY2QyMmIwM2I2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kZ--6xTSfsDgHDDlDqhVvxXFiLSdDCmwYXdThKJQH54",
  },
};

const firstTabButton = document.querySelector(".tabs .first");
const secondTabButton = document.querySelector(".tabs .second");
const firstTab = document.querySelector('[data-tab="first"]');
const secondTab = document.querySelector('[data-tab="second"]');
const tooltipDisplay = document.querySelector("[data-tooltip-display]");
const temp = document.createElement("span");
const titleUrl = document.createElement("a");
const popularityEl = document.querySelector("[data-popularity]");
const votesEl = document.querySelector("[data-votes]");
const revenueEl = document.querySelector("[data-revenue]");
const budgetEl = document.querySelector("[data-budget]");
const profitEl = document.querySelector("[data-profit]");
const ratingEl = document.querySelector("[data-rating] #arrow");
const runtimeEl = document.querySelector("[data-runtime]");
const locationEl = document.querySelector("[data-location]");
const subtitle = document.querySelector(".subtitle .content");
const date = document.createElement("span");
const runtime = document.createElement("span");
const countries = document.createElement("span");
const rating = document.createElement("span"); // CONTINUE HERE
const votes = document.createElement("span");
const popularity = document.createElement("span");
const mainScreen = document.querySelector(".main-screen");
const posterScreen = document.querySelector(".poster-screen");
const movieIdDisplay = document.querySelector(".poster-screen .container");
const genres = document.querySelector(".row.genres .content");
const directorsElement = document.querySelector(".row.directors .content");
const actorsElement = document.querySelector(".row.actors .content");

const genreFilterContainer = document.querySelector(".filters .genres");
const countriesFilterList = document.querySelector(".countries .content");
bindHoverTooltip(genreFilterContainer);
bindHoverTooltip(firstTabButton);
bindHoverTooltip(secondTabButton);
bindHoverTooltip(countriesFilterList.parentElement);
let allGenres = [];
let filteredGenres = [];
let allCountries = [];

firstTabButton.addEventListener("click", (e) => {
  firstTabButton.classList.add("active");
  secondTabButton.classList.remove("active");
  firstTab.classList.add("active");
  secondTab.classList.remove("active");
});
secondTabButton.addEventListener("click", (e) => {
  secondTabButton.classList.add("active");
  firstTabButton.classList.remove("active");
  secondTab.classList.add("active");
  firstTab.classList.remove("active");
});

function bindHoverTooltip(element) {
  element.addEventListener("mouseover", (e) => {
    tooltipDisplay.innerText = element.getAttribute("data-tooltip");
  });
  element.addEventListener("mouseout", (e) => {
    tooltipDisplay.innerText = "sguueeet";
  });
}

generateCountries().then(generateGenres).then(fetchMovies);
submit.addEventListener("click", (e) => fetchMovies());

function generateGenres() {
  return fetch("https://api.themoviedb.org/3/genre/movie/list", options)
    .then((response) => response.json())
    .then((response) => {
      allGenres = response.genres;
      const options = genreFilterContainer.querySelector(".genres .content");
      const value = genreFilterContainer.querySelector(".value");
      value.addEventListener("click", (e) => {
        console.log("ASDSD");
        genreFilterContainer.classList.toggle("open");
        countriesFilterList.parentElement.classList.remove("open");
      });

      function displaySelectedCountry(temp) {
        temp.classList.toggle("selected");
        filteredGenres.push(temp.id);
        const selectedOptions = Array.from(
          options.querySelectorAll(".selected")
        );
        if (selectedOptions.length !== 0) {
          selectedOptions.forEach((item, index) => {
            if (index === 0) {
              value.innerText = item.innerText;
            } else {
              value.innerText += ", " + item.innerText;
            }
          });
        } else {
          value.innerText = "Any";
        }
      }
      allGenres.forEach((genre) => {
        const temp = document.createElement("span");
        temp.setAttribute("data-id", genre.id);
        temp.innerText = genre.name;
        temp.className = "option button-span link";
        temp.addEventListener("click", (e) => {
          displaySelectedCountry(temp);
        });
        options.appendChild(temp);
      });
      console.log(options.children);
    })
    .catch((err) => {
      console.log("error code: ", err.status_code);
    });
}

function generateCountries() {
  return fetch("https://api.themoviedb.org/3/configuration/countries", options)
    .then((response) => response.json())
    .then((response) => {
      const value = document.querySelector(".value");
      value.addEventListener("click", (e) => {
        countriesFilterList.parentElement.classList.toggle("open");
        genreFilterContainer.classList.remove("open");
        console.log("clcick");
      });

      function toggleSelection(temp) {
        temp.classList.toggle("selected");
        const selected = Array.from(
          document.querySelectorAll(".countries .content .option.selected")
        );

        selected.forEach((item) => {
          if (item !== temp) {
            item.classList.remove("selected");
          }
        });

        if (selected.length == 0) {
          value.innerText = "Any";
          value.setAttribute("data-filter-country", "");
        } else {
          value.innerText = temp.innerText;
          value.setAttribute(
            "data-filter-country",
            temp.getAttribute("data-country-id")
          );
        }
      }

      allCountries = response;

      allCountries.forEach((country) => {
        const temp = document.createElement("span");
        temp.className = "option button-span link";
        temp.addEventListener("click", (e) => {
          toggleSelection(temp);
          countriesFilterList.parentElement.classList.remove("open");
        });
        temp.innerText = country.english_name;
        temp.setAttribute("data-country-id", country.iso_3166_1);
        temp.value = country.iso_3166_1;
        countriesFilterList.appendChild(temp);
      });
    })
    .catch((err) => {
      console.log("error code: ", err.status_code);
    });
}

mainScreen.classList.add("loading");
movieIdDisplay.classList.add("loading");
// Add generated movies to cookie to avoid regenerating them
function fetchMovies(queries = "", totalPages = 500) {
  mainScreen.classList.add("loading");
  movieIdDisplay.classList.add("loading");
  ratingEl.style.setProperty("--rotation", `0deg`);

  const countryOfOrigin = document
    .querySelector(".countries .value")
    .getAttribute("data-filter-country");
  const genres = document.querySelectorAll(".filters .genres .option");
  const pageNumber = Math.floor(Math.random() * totalPages);
  const releasedFrom = document.querySelector("#release-from");
  const releasedTo = document.querySelector("#release-to");
  firstTab.classList.add("active");
  firstTabButton.classList.add("active");
  secondTab.classList.remove("active");
  secondTabButton.classList.remove("active");
  //tuka?
  let earliest = 1878;
  let latest = new Date().getFullYear();
  let filteredGenres = [];

  if (releasedFrom.value !== "") {
    earliest = releasedFrom.value;
  }

  if (releasedTo.value !== "") {
    latest = releasedTo.value;
  }

  let _queries = queries;

  // get selected genres
  Array.from(genres).forEach((genre) => {
    if (genre.classList.contains("selected")) {
      filteredGenres.push(genre);
    }
  });
  console.log(filteredGenres);
  console.log(genres);

  if (filteredGenres.length !== 0) {
    _queries += "&with_genres=";
    filteredGenres.forEach((genre) => {
      _queries += genre.getAttribute("data-id") + ",";
    });
  }

  if (releasedFrom !== "" || releasedTo !== "") {
    const fromDate = new Date(earliest, 0, 1);
    const toDate = new Date(latest, 0, 1);
    _queries +=
      "&primary_release_date.gte=" +
      fromDate +
      "&primary_release_date.lte=" +
      toDate;
  }

  if (countryOfOrigin) {
    console.log(countryOfOrigin);
    _queries = "&with_origin_country=" + countryOfOrigin;
  }

  console.log("CURRENT QUERY: ", _queries);

  fetch(
    "https://api.themoviedb.org/3/discover/movie?page=" + pageNumber + _queries,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      if (response.results.length === 0) {
        fetchMovies("", Math.min(500, response.total_pages));
      }
      displayResult(response.results);
    })
    .catch((err) => {
      console.error(err);
      console.log("error code: ", err.status_code);
      console.log("WE COULDNT FIND A MOVIE WITH THOSE PARAMETERS...");
      alert("NO MOVIES WITH THEMS PARAMTETERS, PLEASE ADJUST YA FILTERS!");
    });
}

function getDirectorMovies(id) {
  fetch(
    "https://api.themoviedb.org/3/person/" +
      id +
      "?append_to_response=movie_credits",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      const temp = response.movie_credits.crew.filter(
        (credit) => credit.job === "Director"
      );
      return displayResult(temp, temp.length);
    })
    .catch((err) => {
      console.log("error code: ", err.status_code);
    });
}

function getActorMovies(id) {
  fetch(
    "https://api.themoviedb.org/3/person/" +
      id +
      "?append_to_response=movie_credits",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      const temp = response.movie_credits.cast;
      return displayResult(temp, temp.length);
    })
    .catch((err) => {
      console.log("error code: ", err.status_code);
    });
}

function displayResult(data, maxIndex = 20) {
  const randomIndex = Math.floor(Math.random() * maxIndex);

  data.forEach((movie, index) => {
    if (index === randomIndex) {
      const title = document.querySelector(".title .content");
      bindHoverTooltip(title);
      title.innerHTML = "";

      date.innerText = movie.release_date.split("-")[0];

      temp.className = "button-span";
      temp.classList.add("link");

      titleUrl.innerText = movie.original_title;
      temp.appendChild(titleUrl);
      title.appendChild(temp);

      if (
        movie.original_language !== "en" &&
        movie.original_title != movie.title
      ) {
        titleUrl.innerText += " (" + movie.title + ")";
      }

      // const subtitle = document.createElement("div");
      // subtitle.className = "subtitle";

      movieIdDisplay.setAttribute("data-movie-id", movie.id);
      movieIdDisplay.classList.add("loading");
      date.className = "button-span";
      runtime.className = "button-span";
      rating.className = "button-span"; // shouidl be COUTNRY..
      countries.className = "button-span"; // shouidl be COUTNRY..
      votes.className = "button-span";
      popularity.className = "button-span";

      subtitle.innerHTML = "";
      subtitle.appendChild(date);
      subtitle.appendChild(countries);
      subtitle.appendChild(rating);
      subtitle.appendChild(runtime);

      getImdbUrl(movie);
      getMovieGenres(movie);

      fetch("https://api.themoviedb.org/3/movie/" + movie.id, options)
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA: ", data);
          if (data.poster_path) {
            poster.src = "https://image.tmdb.org/t/p/w500" + data.poster_path;
          }
          getMovieCredits(movie.id, directorsElement, actorsElement);

          const found = allCountries.find(
            (el) => el.iso_3166_1 == data.origin_country[0]
          );
          const plotContent = document.querySelector(".row.plot .content");
          const runtimeMinutes = data.runtime;
          const rate = Math.round(data.vote_average * 10) / 10;
          popularityEl.innerText = data.popularity;
          votesEl.innerText = data.vote_count;
          // ratingEl.innerText = data.vote_average;
          // ratingEl.setAttribute("data-rotation", data.vote_average + "deg");
          const normalized = data.vote_average / 10;
          const deg = normalized * 180;
          ratingEl.style.setProperty("--rotation", `${deg}deg`);
          if (data.revenue === 0) {
            revenueEl.innerText = padNumber("0");
          } else {
            revenueEl.innerText = padNumber(data.revenue);
          }
          if (data.budget === 0) {
            budgetEl.innerText = padNumber("0");
          } else {
            budgetEl.innerText = padNumber(data.budget);
          }
          runtimeEl.innerText = data.runtime;
          profitEl.innerText = padNumber(data.revenue - data.budget);

          bindHoverTooltip(budgetEl);

          plotContent.innerText = data.overview;
          locationEl.innerText = found?.native_name;
          countries.innerText = found?.native_name;
          rating.innerText = rate.toFixed(1);
          runtime.innerText = `${padNumber(
            Math.floor(runtimeMinutes / 60),
            2
          )}:${runtimeMinutes % 60}`;

          if (data.overview === "") {
            plotContent.innerText =
              "No plot found for this movie. You're gonna have to watch it";
          }
          if (data.runtime === 0) {
            subtitle.removeChild(runtime);
          }
        })
        .catch((err) => console.log(err))
        .finally((e) => {
          mainScreen.classList.remove("loading"); // tuak
          movieIdDisplay.classList.remove("loading");
          return;
        });
    }
  });
}

function getMovieGenres(movie) {
  genres.innerHTML = "";

  movie.genre_ids.forEach((genreId) => {
    const genre = allGenres.find((genre) => genre.id == genreId);
    if (genre) {
      const temp = document.createElement("span");
      temp.className = "button-span link";
      // temp.classList.add("link");
      temp.setAttribute(
        "data-tooltip",
        `Genres of this movie, click here to get a random ${genre.name} movie`
      );
      temp.innerText = genre.name;
      temp.addEventListener("click", (e) => getGenreMovies(genre.id));
      bindHoverTooltip(temp);
      genres.appendChild(temp);
    }
  });
}

function getGenreMovies(genre_id) {
  fetchMovies("&with_genres=" + genre_id);
}

function getImdbUrl(movie) {
  fetch(`https://api.themoviedb.org/3/movie/${movie.id}/external_ids`, options)
    .then((response) => response.json())
    .then((data) => {
      const imdbUrl = `https://www.imdb.com/title/${data.imdb_id}/`;
      titleUrl.href = imdbUrl;
      titleUrl.target = "_blank";
    })
    .catch((err) => console.error(err));
}

function padNumber(number, size = 10) {
  const temp = "0000000000" + number;
  return temp.substring(temp.length - size);
}

function getMovieCredits(id, directorsEl, actorsEl) {
  fetch("https://api.themoviedb.org/3/movie/" + id + "/credits", options)
    .then((response) => response.json())
    .then((data) => {
      const actors = data.cast.filter((person, index) => index <= 2);
      const directors = data.crew.filter((person) => person.job == "Director");

      directorsEl.innerHTML = "";
      actorsEl.innerHTML = "";

      directors.forEach((director) => {
        const temp = document.createElement("span");
        temp.className = "button-span";
        temp.classList.add("link");
        temp.innerText = director.name;
        temp.addEventListener("click", (e) => getDirectorMovies(director.id));

        directorsEl.appendChild(temp);
      });

      actors.forEach((actor) => {
        const temp = document.createElement("span");
        temp.className = "button-span";
        temp.classList.add("link");
        temp.innerText = actor.name;
        temp.addEventListener("click", (e) => {
          getActorMovies(actor.id);
        });

        actorsEl.appendChild(temp);
      });
    });
}
