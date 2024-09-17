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
    const content = document.createElement("div");
    const title = document.createElement("h3");
    const releaseDate = document.createElement("p");
    const image = document.createElement("img");
    card.className = "card";
    image.className = "poster";
    title.innerText = movie.original_title;
    releaseDate.innerText = movie.release_date.split("-")[0];
    movie.genre_ids.forEach((genreId) => {
      console.log("THIS IS GENRE ID: ", genreId);
      const genre = allGenres.find((genre) => genre.id == genreId);
      currentGenres.push(genre.name);
    });

    console.log("GENRESZZ: ", currentGenres);
    if (index === randomIndex) {
      card.classList.add("active");
      fetch("https://api.themoviedb.org/3/movie/" + movie.id, options)
        .then((response) => response.json())
        .then((data) => {
          console.log("data; ", data);
          image.src = "https://image.tmdb.org/t/p/w500" + data.poster_path;
          card.style.backgroundImage =
            "url(https://image.tmdb.org/t/p/w780" + data.backdrop_path + ")";
        })
        .catch((err) => console.log(err));
    }

    card.appendChild(image);
    content.appendChild(title);
    content.appendChild(releaseDate);
    card.appendChild(content);
    resultsContainer.appendChild(card);
  });
}
