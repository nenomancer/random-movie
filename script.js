const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODg3OTU1MzhmOGVmMGUxMTU5Y2E3MWJlNTM4YmU4NCIsIm5iZiI6MTcyNjM0NTM1OC4xMTg2MTEsInN1YiI6IjY2ZTVlZjYzZTgyMTFlY2QyMmIwM2I2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KH0FgzN9_EB8DUyXpM_VGQzlpuE8-CFyzIUVBpSTOU8",
  },
};

let movies;

const locales = [
    'en-US', 'fr-FR', 'de-DE', 'es-ES', 'it-IT',
    'pt-BR', 'ja-JP', 'zh-CN', 'ko-KR', 'ru-RU'
];

function getMovies(data) {
  data.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "card";
    const title = document.createElement("p");
    title.innerText = movie.original_title;
    const releaseDate = document.createElement("p");
    releaseDate.innerText = movie.release_date;

    div.appendChild(title);
    div.appendChild(releaseDate);
    document.querySelector(".main-container").appendChild(div);
  });
}

function applyFilters(filters) {
  console.log(filters);
}
fetch(
  "https://api.themoviedb.org/3/discover/movie?sort_by=primary_release_date.asc",
  options
)
  .then((response) => response.json())
  .then((response) => {
    // console.log(response.results);
    // getMovies(response.results);
  })
  .catch((err) => console.error(err));

async function fetchCountryCodes() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    const countryCodes = countries.reduce((acc, country) => {
      acc[country.cca2] = country.name.common; // cca2 is the ISO 3166-1 alpha-2 code
      return acc;
    }, {});

    return countryCodes;
  } catch (error) {
    console.error("Error fetching country codes:", error);
    return {};
  }
}

// Example usage
fetchCountryCodes().then((codes) => {
  console.log(codes);
  const randomCode = locales[Math.floor(Math.random() * locales.length)];
  console.log('radnom: ', randomCode);
  fetch(
    "https://api.themoviedb.org/3/discover/movie?region=" + randomCode,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log('fetching ' + "https://api.themoviedb.org/3/discover/movie?region=" + randomCode)
      console.log(response.results);
      getMovies(response.results);
    })
    .catch((err) => console.error(err));
});
