export const API = {
    OPTIONS: {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODg3OTU1MzhmOGVmMGUxMTU5Y2E3MWJlNTM4YmU4NCIsIm5iZiI6MTcyNjUyMjM0OS4xNTU2MzEsInN1YiI6IjY2ZTVlZjYzZTgyMTFlY2QyMmIwM2I2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kZ--6xTSfsDgHDDlDqhVvxXFiLSdDCmwYXdThKJQH54",
        },
    },
    COUNTRIES: "https://api.themoviedb.org/3/configuration/countries",
    GENRES: "https://api.themoviedb.org/3/genre/movie/list",
    PERSON: "https://api.themoviedb.org/3/person",
    MOVIE: "https://api.themoviedb.org/3/movie",
    DISCOVER_MOVIE: "https://api.themoviedb.org/3/discover/movie",
    POSTER: "https://image.tmdb.org/t/p/w500",
}