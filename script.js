const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    // Authorization:
    // "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODg3OTU1MzhmOGVmMGUxMTU5Y2E3MWJlNTM4YmU4NCIsIm5iZiI6MTcyNjM0NTM1OC4xMTg2MTEsInN1YiI6IjY2ZTVlZjYzZTgyMTFlY2QyMmIwM2I2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KH0FgzN9_EB8DUyXpM_VGQzlpuE8-CFyzIUVBpSTOU8",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODg3OTU1MzhmOGVmMGUxMTU5Y2E3MWJlNTM4YmU4NCIsIm5iZiI6MTcyNjUyMjM0OS4xNTU2MzEsInN1YiI6IjY2ZTVlZjYzZTgyMTFlY2QyMmIwM2I2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kZ--6xTSfsDgHDDlDqhVvxXFiLSdDCmwYXdThKJQH54",
  },
};

const resultsContainer = document.querySelector("#results");
const formCountries = document.querySelector('form[name="filters"]');
let allGenres = [];

getGenres();
fetchMovies({ country: "" });

function getGenres() {
  fetch("https://api.themoviedb.org/3/genre/movie/list", options)
    .then((response) => response.json())
    .then((response) => {
      allGenres = response.genres;
    })
    .catch((err) => console.error(err));
}
function generateCountries(params) {
  fetch("https://api.themoviedb.org/3/configuration/countries", options)
    .then((response) => response.json())
    .then((response) => {
      console.log("countries:");
      console.log(response);
    })
    .catch((err) => console.error(err));
}

formCountries.addEventListener("submit", (e) => {
  e.preventDefault();
  // get the country from select element
  const selectedCountry = formCountries.querySelector("#countries").value;
  fetchMovies({ country: selectedCountry });
});

// Add generated movies to cookie to avoid regenerating them
function fetchMovies(params, totalPages = 500) {
  console.log(params.country);
  const pageNumber = Math.floor(Math.random() * totalPages);
  let queries = "";
  if (params.country) {
    queries = "&with_origin_country=" + params.country;
  }
  fetch(
    "https://api.themoviedb.org/3/discover/movie?page=" + pageNumber + queries,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      if (response.results.length === 0) {
        fetchMovies(params, Math.min(500, response.total_pages));
      }
      getMovies(response.results);
    })
    .catch((err) => console.error(err));
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
      return getMovies(temp, temp.length);
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
      return getMovies(temp, temp.length);
    })
    .catch((err) => console.error(err));
}

function getGenreMovies(id) {
  fetch(
    "https://api.themoviedb.org/3/discover/movie?with_genres=" + id,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      const temp = response.results;
      return getMovies(temp, temp.length);
    })
    .catch((err) => console.error(err));
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

function getMovies(data, maxIndex = 20) {
  const randomIndex = Math.floor(Math.random() * maxIndex);

  resultsContainer.innerHTML = "";
  data.forEach((movie, index) => {
    const currentGenres = [];
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h2");
    title.innerText = movie.original_title;

    if (movie.original_language !== "en") {
      title.innerText += " (" + movie.title + ")";
    }

    const subtitle = document.createElement("div");
    subtitle.className = "subtitle2";

    const date = document.createElement("span");
    date.innerText = movie.release_date.split("-")[0];
    const runtime = document.createElement("span");

    subtitle.appendChild(date);
    subtitle.appendChild(runtime);

    const poster = document.createElement("img");
    poster.className = "poster";

    const background = document.createElement("img");
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

    appendChildren(card, [background, poster, header]);

    resultsContainer.appendChild(card);

    getGenres();
    function getGenres() {
      movie.genre_ids.forEach((genreId) => {
        const genre = allGenres.find((genre) => genre.id == genreId);
        console.log("GENRE: ", genre);
        if (genre) {
          const tempGenre = document.createElement("span");
          // console.log('genre: ', genre);
          tempGenre.addEventListener("click", (e) => getGenreMovies(genre.id));
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

    if (index === randomIndex) {
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
          background.src =
            "https://image.tmdb.org/t/p/w500" + data.backdrop_path;
          plotContent.innerText = data.overview;
          const runtimeMinutes = data.runtime;
          runtime.innerText = `${Math.floor(runtimeMinutes / 60)}h ${
            runtimeMinutes % 60
          }min`;
        })
        .catch((err) => console.log(err));
    }
  });
}
