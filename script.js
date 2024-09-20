const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODg3OTU1MzhmOGVmMGUxMTU5Y2E3MWJlNTM4YmU4NCIsIm5iZiI6MTcyNjUyMjM0OS4xNTU2MzEsInN1YiI6IjY2ZTVlZjYzZTgyMTFlY2QyMmIwM2I2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kZ--6xTSfsDgHDDlDqhVvxXFiLSdDCmwYXdThKJQH54",
  },
};

const resultsContainer = document.querySelector("#results");
const filterForm = document.querySelector('form[name="filters"]');
const toggleFirstTab = document.querySelector(".tabs .first");
const toggleSecondTab = document.querySelector(".tabs .second");
const firstTab = document.querySelector('[data-tab="first"]');
const secondTab = document.querySelector('[data-tab="second"]');
toggleFirstTab.addEventListener("click", (e) => {
  toggleFirstTab.classList.add("active");
  toggleSecondTab.classList.remove("active");
  firstTab.classList.add("active");
  secondTab.classList.remove("active");
});
toggleSecondTab.addEventListener("click", (e) => {
  toggleSecondTab.classList.add("active");
  toggleFirstTab.classList.remove("active");
  secondTab.classList.add("active");
  firstTab.classList.remove("active");
});
let allGenres = [];
let filteredGenres = [];
let allCountries = [];

generateCountries().then(getGenres).then(fetchMovies);

function getGenres() {
  return fetch("https://api.themoviedb.org/3/genre/movie/list", options)
    .then((response) => response.json())
    .then((response) => {
      allGenres = response.genres;
      const container = document.querySelector("#filters .genres");
      const options = container.querySelector(".genres .content");
      const value = container.querySelector(".value");
      value.addEventListener("click", (e) =>
        container.classList.toggle("open")
      );
      function displaySelectedCountry(temp) {
        temp.classList.toggle("selected");
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
        temp.className = "option button-span";
        temp.addEventListener("click", (e) => {
          displaySelectedCountry(temp);
        });
        options.appendChild(temp);
      });
      console.log(options.children);
    })
    .catch((err) => console.error(err));
}

function generateCountries(params) {
  return fetch("https://api.themoviedb.org/3/configuration/countries", options)
    .then((response) => response.json())
    .then((response) => {
      const countriesList = document.querySelector(".countries .content");
      const value = document.querySelector(".value");
      value.addEventListener("click", (e) => {
        countriesList.parentElement.classList.toggle("open");
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
        temp.className = "option";
        temp.addEventListener("click", (e) => {
          toggleSelection(temp);
          countriesList.parentElement.classList.remove("open");
        });
        temp.innerText = country.english_name;
        temp.setAttribute("data-country-id", country.iso_3166_1);
        temp.value = country.iso_3166_1;
        countriesList.appendChild(temp);
      });
    })
    .catch((err) => console.error(err));
}

filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchMovies();
});

// Add generated movies to cookie to avoid regenerating them
function fetchMovies(queries = "", totalPages = 500) {
  const countryOfOrigin = document
    .querySelector(".countries .value")
    .getAttribute("data-filter-country");
  const genres = document.querySelectorAll("#filters .genres .option");
  const pageNumber = Math.floor(Math.random() * totalPages);
  const releasedFrom = document.querySelector("#release-from");
  const releasedTo = document.querySelector("#release-to");
  firstTab.classList.add("active");
  toggleFirstTab.classList.add("active");
  secondTab.classList.remove("active");
  toggleSecondTab.classList.remove("active");
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
  filteredGenres = Array.from(genres).filter((genre) =>
    genre.classList.contains("selected")
  );

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
    .catch((err) => console.error(err));
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
    .catch((err) => console.error(err));
}

function getGenreMovies(id) {
  fetchMovies("&with_genres=" + id);
}

// function createInfoRow(name) {
//   const elem = document.createElement("div");
//   elem.className = "row " + name.toLowerCase();
//   elem.innerHTML = `<p>${name}</p>`;
//   return elem;
// }

function appendChildren(parent, children) {
  children.forEach((child) => parent.appendChild(child));
}

function displayResult(data, maxIndex = 20) {
  const randomIndex = Math.floor(Math.random() * maxIndex);

  resultsContainer.innerHTML = "";
  data.forEach((movie, index) => {
    if (index === randomIndex) {
      const title = document.querySelector(".title .content");
      title.innerHTML = "";
      const temp = document.createElement("span");
      const titleUrl = document.createElement("a");

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

      const popularityEl = document.querySelector("[data-popularity]");
      const votesEl = document.querySelector("[data-votes]");
      const revenueEl = document.querySelector("[data-revenue]");
      const subtitle = document.querySelector(".subtitle .content");
      const date = document.createElement("span");
      date.innerText = movie.release_date.split("-")[0];
      const runtime = document.createElement("span");
      const countries = document.createElement("span");
      const rating = document.createElement("span"); // CONTINUE HERE

      const votes = document.createElement("span");
      const popularity = document.createElement("span");

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

      getMovieGenres();
      getImdbUrl();

      function getImdbUrl() {
        fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/external_ids`,
          options
        )
          .then((response) => response.json())
          .then((data) => {
            const imdbUrl = `https://www.imdb.com/title/${data.imdb_id}/`;
            titleUrl.href = imdbUrl;
            titleUrl.target = "_blank";
          })
          .catch((err) => console.error(err));
      }

      function getMovieGenres() {
        const genres = document.querySelector(".row.genres .content");
        genres.innerHTML = "";

        movie.genre_ids.forEach((genreId) => {
          const genre = allGenres.find((genre) => genre.id == genreId);
          if (genre) {
            const temp = document.createElement("span");
            temp.className = "button-span";
            temp.classList.add("link");
            temp.innerText = genre.name;
            temp.addEventListener("click", (e) => getGenreMovies(genre.id));
            genres.appendChild(temp);
          }
        });
      }

      // function getCastNames(data, element, onClick) {
      //   data.forEach((person) => {
      //     const temp = document.createElement("span");
      //     temp.innerText = person.name;
      //     temp.addEventListener("click", (e) => onClick(person.id));
      //     element.appendChild(temp);
      //   });
      // }

      fetch("https://api.themoviedb.org/3/movie/" + movie.id, options)
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA: ", data);
          if (data.poster_path) {
            console.log("poster..? ", poster);
            poster.src = "https://image.tmdb.org/t/p/w500" + data.poster_path;
          }
          const plotContent = document.querySelector(".row.plot .content");
          const runtimeMinutes = data.runtime;
          popularityEl.innerText = "popularity: " + data.popularity;
          votesEl.innerText = "votes: " + data.vote_count;
          revenueEl.innerText = "revenue: " + data.revenue;
          plotContent.innerText = data.overview;

          if (data.overview === "") {
            plotContent.innerText =
              "No plot found for this movie. You're gonna have to watch it";
          }
          if (data.runtime === 0) {
            subtitle.removeChild(runtime);
          }

          const found = allCountries.find(
            (el) => el.iso_3166_1 == data.origin_country[0]
          );

          countries.innerText = found.native_name;
          const rate = Math.round(data.vote_average * 10) / 10;
          rating.innerText = rate.toFixed(1);
          runtime.innerText = `${Math.floor(runtimeMinutes / 60)}h ${
            runtimeMinutes % 60
          }min`;
          getMovieCredits(movie.id);
        })
        .catch((err) => console.log(err));
    }
  });

  function getMovieCredits(id) {
    fetch("https://api.themoviedb.org/3/movie/" + id + "/credits", options)
      .then((response) => response.json())
      .then((data) => {
        const actors = data.cast.filter((person, index) => index <= 2);
        const directors = data.crew.filter(
          (person) => person.job == "Director"
        );

        const directorsElement = document.querySelector(
          ".row.directors .content"
        );
        directorsElement.innerHTML = "";

        const actorsElement = document.querySelector(".row.actors .content");
        actorsElement.innerHTML = "";

        directors.forEach((director) => {
          const temp = document.createElement("span");
          temp.className = "button-span";
          temp.classList.add("link");
          temp.innerText = director.name;
          temp.addEventListener("click", (e) => getDirectorMovies(director.id));

          directorsElement.appendChild(temp);
        });

        actors.forEach((actor) => {
          const temp = document.createElement("span");
          temp.className = "button-span";
          temp.classList.add("link");
          temp.innerText = actor.name;
          temp.addEventListener("click", (e) => {
            getActorMovies(actor.id);
          });

          actorsElement.appendChild(temp);
        });
      });
  }
}
