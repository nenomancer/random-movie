<script lang="ts">
    import { formatRuntime, padNumber } from "../../lib/helpers";
    import { currentMovie } from "../../stores/movie";
    import Button from "../ui/Button.svelte";

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
            return "-";
        }
    }

    function getYearLabel() {
        if ($currentMovie.year) {
            return $currentMovie.year.toString();
        } else {
            return "-";
        }
    }

    function getLabel(property: any) {
        if (property) {
            return property.toString();
        } else {
            return "-";
        }
    }
</script>

<section class="extra-information" aria-label="Extra information">
    <Button
        label={getYearLabel()}
        onClick={() =>
            $currentMovie.year && getMoviesByReleaseDate($currentMovie.year)}
        ariaLabel={`Release year: ${$currentMovie.year}`}
        description={`This movie's release year. Click to find another movie released in ${$currentMovie.year}.`}
    />
    <Button
        label={getLabel($currentMovie.country?.native)}
        onClick={() =>
            $currentMovie.country &&
            getMoviesByCountry($currentMovie.country?.code)}
        ariaLabel={`Country: ${$currentMovie.country?.name}.`}
        description={`This movie's country of origin. Click to find another movie from ${$currentMovie.country?.name}`}
    />
    <Button
        label={getLabel($currentMovie.rating)}
        onClick={() =>
            $currentMovie.rating && getMoviesByRating($currentMovie.rating)}
        ariaLabel={`TMDB rating: ${$currentMovie.rating}.`}
        description={`TMDB rating: ${$currentMovie.rating}. Click to find another movie with a similar rating.`}
        disabled={!$currentMovie.rating}
    />
    <Button
        label={getRuntimeLabel()}
        onClick={() => getMoviesByRuntime($currentMovie.runtime!)}
        ariaLabel={getRuntimeAria()}
        description={getRuntimeDescription()}
    />
</section>

<style lang="scss">
    section {
        display: flex;
        justify-content: stretch;
        font-size: 1rem;

        button {
            padding: 200px;
        }
    }
</style>
