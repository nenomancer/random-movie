<script lang="ts">
    import { formatRuntime, padNumber } from "../lib/helpers";
    import { currentMovie } from "../stores/movie";
    import Button from "./Button.svelte";

    export let getMoviesByReleaseDate: (currentYear: number) => void;
    export let getMoviesByCountry: (countryCode: string) => void;
    export let getMoviesByRating: (rating: number) => void;
    export let getMoviesByRuntime: (runtime: number) => void;
</script>

<section aria-label="Extra information">
    <!-- Release date  -->
    {#if $currentMovie.year}
        <Button
            label={$currentMovie.year.toString()}
            onClick={() => getMoviesByReleaseDate($currentMovie.year!)}
            ariaLabel={`Release year: ${$currentMovie.year}`}
            description={`This movie's release year. Click to find another movie released in ${$currentMovie.year}.`}
        />
    {/if}

    <!-- Country  -->
    {#if $currentMovie.country}
        <Button
            label={$currentMovie.country.name}
            onClick={() => getMoviesByCountry($currentMovie.country.code)}
            ariaLabel={`Country: ${$currentMovie.country.name}.`}
            description={`This movie's country of origin. Click to find another movie from ${$currentMovie.country.name}`}
        />
    {/if}

    <!-- Rating  -->
    {#if $currentMovie.rating}
        <Button
            label={$currentMovie.rating.toString()}
            onClick={() => getMoviesByRating($currentMovie.rating!)}
            ariaLabel={`IMDB rating: ${$currentMovie.rating}.`}
            description={`This movie is rated ${$currentMovie.rating}. Click to find another movie with a similar rating.`}
        />
    {/if}

    <!-- Runtime  -->
    {#if $currentMovie.runtime}
        <Button
            label={formatRuntime($currentMovie.runtime)}
            onClick={() => getMoviesByRuntime($currentMovie.runtime!)}
            ariaLabel={`Runtime: ${padNumber(Math.floor($currentMovie.runtime / 60), 2)} hours and ${padNumber($currentMovie.runtime % 60, 2)} minutes`}
            description={`Runtime: ${formatRuntime($currentMovie.runtime)}. Click to find another movie with a similar runtime.`}
        />
    {/if}
</section>
