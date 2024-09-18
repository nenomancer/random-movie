const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODg3OTU1MzhmOGVmMGUxMTU5Y2E3MWJlNTM4YmU4NCIsIm5iZiI6MTcyNjUyMjM0OS4xNTU2MzEsInN1YiI6IjY2ZTVlZjYzZTgyMTFlY2QyMmIwM2I2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kZ--6xTSfsDgHDDlDqhVvxXFiLSdDCmwYXdThKJQH54",
  },
};

const resultsContainer = document.querySelector("#results");
const formCountries = document.querySelector('form[name="filters"]');
let allGenres = [];
let filteredGenres = [];

generateCountries().then(getGenres).then(fetchMovies);

function getGenres() {
  return fetch("https://api.themoviedb.org/3/genre/movie/list", options)
    .then((response) => response.json())
    .then((response) => {
      allGenres = response.genres;
      const container = document.querySelector("#genres");
      const options = container.querySelector("#genre-options");
      const toggleButton = container.querySelector(".toggle");
      toggleButton.addEventListener("click", (e) =>
        container.classList.toggle("open")
      );
      allGenres.forEach((genre) => {
        const temp = document.createElement("div");
        temp.setAttribute("data-id", genre.id);
        temp.innerText = genre.name;
        temp.className = "option";

        temp.addEventListener("click", (e) => {
          temp.classList.toggle("selected");
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
      const countryInput = document.querySelector("#countries");
      response.forEach((country) => {
        const temp = document.createElement("option");
        temp.innerText = country.english_name;
        temp.value = country.iso_3166_1;
        countryInput.appendChild(temp);
      });
    })
    .catch((err) => console.error(err));
}

formCountries.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchMovies();
});

// Add generated movies to cookie to avoid regenerating them
function fetchMovies(queries = "", totalPages = 500) {
  const countryOfOrigin = document.querySelector("#countries").value; //
  const genres = document.querySelectorAll("#genres .option");
  const pageNumber = Math.floor(Math.random() * totalPages);
  const releasedFrom = document.querySelector("#release-from");
  const releasedTo = document.querySelector("#release-to");
  let earliest = 1878;
  let latest = new Date().getFullYear();
  let filteredGenres = [];

  filteredGenres = Array.from(genres).filter(genre => genre.classList.contains("selected"));
  console.log("FILTERED: ", filteredGenres);
  

  if (releasedFrom.value !== "") {
    earliest = releasedFrom.value;
  }

  if (releasedTo.value !== "") {
    latest = releasedTo.value;
  }

  // ERROR CASE IF MOVIE PARAMS DONT PRODUCE RESUTLS
  let _queries = queries;

  if (filteredGenres.length !== 0) {

    _queries += "&with_genres="
    filteredGenres.forEach((genre) => {
      _queries += genre.getAttribute('data-id') + ","
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
      console.log("WE COULDNT FIND A MOVIE WITH THOSE PARAMETERS...")
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

function createInfoRow(name) {
  const elem = document.createElement("div");
  elem.className = "row " + name.toLowerCase();
  elem.innerHTML = `<p>${name}</p>`;
  return elem;
}

function appendChildren(parent, children) {
  children.forEach((child) => parent.appendChild(child));
}

function displayResult(data, maxIndex = 20) {
  const randomIndex = Math.floor(Math.random() * maxIndex);

  resultsContainer.innerHTML = "";
  data.forEach((movie, index) => {
    if (index === randomIndex) {
      const currentGenres = [];
      const card = document.createElement("div");
      card.className = "result";

      console.log(movie.vote_average);

      const title = document.createElement("h2");
      title.className = "title";
      const titleUrl = document.createElement("a");
      title.appendChild(titleUrl);
      titleUrl.innerText = movie.original_title;

      if (
        movie.original_language !== "en" &&
        movie.original_title != movie.title
      ) {
        titleUrl.innerText += " (" + movie.title + ")";
      }

      const subtitle = document.createElement("div");
      subtitle.className = "subtitle";

      const date = document.createElement("span");
      date.innerText = movie.release_date.split("-")[0];
      const runtime = document.createElement("span");
      const rating = document.createElement("span"); // CONTINUE HERE

      subtitle.appendChild(date);
      subtitle.appendChild(runtime);
      subtitle.appendChild(rating);

      const poster = document.createElement("img");
      poster.className = "poster";

      const background = document.createElement("div");
      background.className = "background";

      const header = document.createElement("div");
      const info = document.createElement("div");
      info.className = "info";

      const genres = createInfoRow("Genres");
      const genreContent = document.createElement("div");

      const plot = createInfoRow("Plot");
      const plotContent = document.createElement("p");

      const directors = createInfoRow("Directors");
      const directorContent = document.createElement("div");

      const stars = createInfoRow("Stars");
      const starsContent = document.createElement("div");

      genres.appendChild(genreContent);
      directors.appendChild(directorContent);
      stars.appendChild(starsContent);
      plot.appendChild(plotContent);

      appendChildren(info, [genres, directors, stars, plot]);

      appendChildren(header, [title, subtitle, info]);

      const backgroundContainer = document.createElement("div");
      backgroundContainer.className = "backgroundContainer";
      backgroundContainer.appendChild(background);

      appendChildren(card, [backgroundContainer, poster, header]);
      console.log(card);
      resultsContainer.appendChild(card);

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
            // titleUrl.setAttribute("src", imdbUrl);
            titleUrl.href = imdbUrl;
            titleUrl.target = "_blank";
            title.addEventListener("click", (e) => {
              console.log(titleUrl);
              titleUrl.click();
            });
          })
          .catch((err) => console.error(err));
      }

      function getMovieGenres() {
        movie.genre_ids.forEach((genreId) => {
          const genre = allGenres.find((genre) => genre.id == genreId);
          if (genre) {
            const tempGenre = document.createElement("span");
            // console.log('genre: ', genre);
            tempGenre.addEventListener("click", (e) =>
              getGenreMovies(genre.id)
            );
            tempGenre.innerText = genre.name;
            genreContent.appendChild(tempGenre);
          }
          currentGenres.push(genre.name);
        });
      }

      function getCastNames(data, element, onClick) {
        data.forEach((person) => {
          const temp = document.createElement("span");
          temp.innerText = person.name;
          temp.addEventListener("click", (e) => onClick(person.id));
          element.appendChild(temp);
        });
      }

      card.classList.add("active");

      fetch("https://api.themoviedb.org/3/movie/" + movie.id, options)
        .then((response) => response.json())
        .then((data) => {
          fetch(
            "https://api.themoviedb.org/3/movie/" + movie.id + "/credits",
            options
          )
            .then((response) => response.json())
            .then((data) => {
              const stars = data.cast.filter((person, index) => index <= 2);
              const directors = data.crew.filter(
                (person) => person.job == "Director"
              );

              getCastNames(stars, starsContent, getActorMovies);
              getCastNames(directors, directorContent, getDirectorMovies);
            });

          poster.src = "https://image.tmdb.org/t/p/w500" + data.poster_path;
          background.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${data.backdrop_path}`;
          plotContent.innerText = data.overview;
          if (data.runtime === 0) {
            subtitle.removeChild(runtime);
          }
          const runtimeMinutes = data.runtime;
          rating.innerText = data.vote_average;
          runtime.innerText = `${Math.floor(runtimeMinutes / 60)}h ${
            runtimeMinutes % 60
          }min`;
        })
        .catch((err) => console.log(err));
    }
  });
}
