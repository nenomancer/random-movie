<script lang="ts">
    import { formatRuntime, padNumber } from "../lib/helpers";
    import { currentMovie } from "../stores/movie";
    import Button from "./Button.svelte";

    export let getMoviesByReleaseDate: (currentYear: number) => void;
    export let getMoviesByCountry: (countryCode: string) => void;
    export let getMoviesByRating: (rating: number) => void;
    export let getMoviesByRuntime: (runtime: number) => void;

    function getRuntimeAria() {
        if ($currentMovie.runtime) {
            return `Runtime: ${padNumber(Math.floor($currentMovie.runtime / 60), 2)} hours and ${padNumber($currentMovie.runtime % 60, 2)} minutes`;
        } else {
            return "Runtime is undefined.";
        }
    }

    function getRuntimeDescription() {
        if ($currentMovie.runtime) {
            return `Runtime: ${formatRuntime($currentMovie.runtime)}. Click to find another movie with a similar runtime.`;
        } else {
            return "Runtime is undefined.";
        }
    }

    function getRuntimeLabel() {
        if ($currentMovie.runtime) {
            return formatRuntime($currentMovie.runtime);
        } else {
            return undefined;
        }
    }
</script>

<section class="extra-information" aria-label="Extra information">
    <!-- {#if $currentMovie.year} -->
    <Button
        label={$currentMovie.year ? $currentMovie.year.toString() : undefined}
        onClick={() => getMoviesByReleaseDate($currentMovie.year!)}
        ariaLabel={`Release year: ${$currentMovie.year}`}
        description={`This movie's release year. Click to find another movie released in ${$currentMovie.year}.`}
    />
    <!-- {/if} -->
    <!-- {#if $currentMovie.country} -->
    <Button
        label={$currentMovie.country.native}
        onClick={() => getMoviesByCountry($currentMovie.country.code)}
        ariaLabel={`Country: ${$currentMovie.country.name}.`}
        description={`This movie's country of origin. Click to find another movie from ${$currentMovie.country.name}`}
    />
    <!-- {/if} -->
    <!-- {#if $currentMovie.rating} -->
    <Button
        label={$currentMovie.rating
            ? $currentMovie.rating.toString()
            : undefined}
        onClick={() => getMoviesByRating($currentMovie.rating!)}
        ariaLabel={`TMDB rating: ${$currentMovie.rating}.`}
        description={`TMDB rating: ${$currentMovie.rating}. Click to find another movie with a similar rating.`}
    />
    <!-- {/if} -->
    <!-- {#if $currentMovie.runtime} -->
    <Button
        label={getRuntimeLabel()}
        onClick={() => getMoviesByRuntime($currentMovie.runtime!)}
        ariaLabel={getRuntimeAria()}
        description={getRuntimeDescription()}
    />
    <!-- {/if} -->
</section>

<style>
    section {
        display: flex;
        justify-content: stretch;
    }
</style>
