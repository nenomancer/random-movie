export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getImdbUrl(movie) {
    fetch(`${API.MOVIE}${movie.id}/external_ids`, options)
        .then((response) => response.json())
        .then((data) => {
            const imdbUrl = `https://www.imdb.com/title/${data.imdb_id}/`;
            titleUrl.href = imdbUrl;
            titleUrl.target = "_blank";
        })
        .catch((err) => console.error(err));
}
