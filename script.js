const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    // Authorization:
    // "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODg3OTU1MzhmOGVmMGUxMTU5Y2E3MWJlNTM4YmU4NCIsIm5iZiI6MTcyNjM0NTM1OC4xMTg2MTEsInN1YiI6IjY2ZTVlZjYzZTgyMTFlY2QyMmIwM2I2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KH0FgzN9_EB8DUyXpM_VGQzlpuE8-CFyzIUVBpSTOU8",
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODg3OTU1MzhmOGVmMGUxMTU5Y2E3MWJlNTM4YmU4NCIsIm5iZiI6MTcyNjUyMjM0OS4xNTU2MzEsInN1YiI6IjY2ZTVlZjYzZTgyMTFlY2QyMmIwM2I2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kZ--6xTSfsDgHDDlDqhVvxXFiLSdDCmwYXdThKJQH54'
  },
};

const resultsContainer = document.querySelector('#results')
const formCountries = document.querySelector('form[name="filters"]')
async function generateCountries(params) {

  await fetch('https://api.themoviedb.org/3/configuration/countries', options)
    .then(response => response.json())
    .then(response => {
      console.log('countries:');
      console.log(response)
    })
    .catch(err => console.error(err));
}
generateCountries();

formCountries.addEventListener('submit', e => {
  e.preventDefault();
  // get the country from select element
  fetchMovies({ country: formCountries.querySelector("#countries").value});
})

// Maybe generate only one movie per search?
// Add generated movies to cookie to avoid regenerating them
async function fetchMovies(params, totalPages = 500) {
  console.log(params.country);
  const pageNumber = Math.floor(Math.random() * totalPages);
  await fetch(
    "https://api.themoviedb.org/3/discover/movie?page=" + pageNumber + "&with_origin_country=" + params.country,
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
  resultsContainer.innerHTML = '';
  data.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "card";
    const title = document.createElement("p");
    title.innerText = movie.original_title;
    const releaseDate = document.createElement("p");
    releaseDate.innerText = movie.release_date;

    div.appendChild(title);
    div.appendChild(releaseDate);
    resultsContainer.appendChild(div);
  });
}

