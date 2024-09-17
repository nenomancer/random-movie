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

function getGenres() {
  fetch("https://api.themoviedb.org/3/genre/movie/list", options)
    .then((response) => response.json())
    .then((response) => {
      allGenres = response.genres;
      console.log(allGenres);
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
generateCountries();

formCountries.addEventListener("submit", (e) => {
  e.preventDefault();
  // get the country from select element
  fetchMovies({ country: formCountries.querySelector("#countries").value });
});

// Maybe generate only one movie per search?
// Add generated movies to cookie to avoid regenerating them
function fetchMovies(params, totalPages = 500) {
  console.log(params.country);
  const pageNumber = Math.floor(Math.random() * totalPages);
  fetch(
    "https://api.themoviedb.org/3/discover/movie?page=" +
      pageNumber +
      "&with_origin_country=" +
      params.country,
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

function getMovies(data) {
  const randomIndex = Math.floor(Math.random() * 20);

  resultsContainer.innerHTML = "";
  data.forEach((movie, index) => {
    console.log(movie);
    const currentGenres = [];
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h2");
    title.innerText = movie.original_title;

    const releaseDate = document.createElement("p");
    releaseDate.className = "subtitle";
    releaseDate.innerText = movie.release_date.split("-")[0];

    const poster = document.createElement("img");
    poster.className = "poster";

    const background = document.createElement("img");
    background.className = "background";

    const header = document.createElement("div");

    // create table here
    const info = document.createElement("div");
    info.className = "info-table";

    const genres = document.createElement("div");
    const genreContent = document.createElement("div");
    genres.className = "row genres";
    genres.innerHTML = "<p>Genres</p>";

    const plot = document.createElement("div");
    const plotContent = document.createElement("p");
    plot.className = "row plot";
    plot.innerHTML = "<p>Plot</p>";

    const directors = document.createElement("div");
    directors.className = "row directors";
    directors.innerHTML = "<p>Director</p>";
    const directorContent = document.createElement("div");

    const stars = document.createElement("div");
    stars.className = "row stars";
    stars.innerHTML = "<p>Stars</p>";
    const starsContent = document.createElement("div");

    genres.appendChild(genreContent);
    directors.appendChild(directorContent);
    stars.appendChild(starsContent);
    plot.appendChild(plotContent);

    info.appendChild(genres);
    info.appendChild(directors);
    info.appendChild(stars);
    info.appendChild(plot);

    header.appendChild(title);
    header.appendChild(releaseDate);
    header.appendChild(info);

    card.appendChild(background);
    card.appendChild(poster);
    card.appendChild(header);

    resultsContainer.appendChild(card);
    // genre
    // plot
    // direction
    // writers
    // stars
    movie.genre_ids.forEach((genreId) => {
      const genre = allGenres.find((genre) => genre.id == genreId);
      currentGenres.push(genre.name);
    });

    currentGenres.forEach((genre) => {
      const tempGenre = document.createElement("span");
      tempGenre.innerText = genre;
      genreContent.appendChild(tempGenre);
    });

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
              console.log("cast: ", data.cast);
              console.log("director: ", data.crew);

              const stars = data.cast.filter((person, index) => index <= 2);
              console.log("STARRING: ", stars);
              stars.forEach((star) => {
                const temp = document.createElement("span");
                temp.innerText = star.name;
                starsContent.appendChild(temp);
              });
              const directors = data.crew.filter(
                (person) => person.job == "Director"
              );
              console.log("ACTUAL DIRECTOR: ", directors);
              directors.forEach((director) => {
                const temp = document.createElement("span");
                temp.innerText = director.name;
                directorContent.appendChild(temp);
              });
            });
          console.log("data; ", data);

          poster.src = "https://image.tmdb.org/t/p/w500" + data.poster_path;
          background.src =
            "https://image.tmdb.org/t/p/w780" + data.backdrop_path;
          console.log("overview: ", data.overview);
          console.log("runtime: ", data.runtime);
          plotContent.innerText = data.overview;
          console.log("overview: ", data.overview);
        })
        .catch((err) => console.log(err));
    }
  });
}
