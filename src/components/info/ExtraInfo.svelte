<script lang="ts">
  import { derived } from "svelte/store";
  import { formatRuntime, padNumber } from "../../lib/helpers";
  import { currentMovie } from "../../lib/stores";
  import Button from "../ui/Button.svelte";

  const {
    getMoviesByReleaseDate,
    getMoviesByCountry,
    getMoviesByRating,
    getMoviesByRuntime,
  } = $props<{
    getMoviesByReleaseDate: (currentYear: number) => void;
    getMoviesByCountry: (countryCode: string) => void;
    getMoviesByRating: (rating: number) => void;
    getMoviesByRuntime: (runtime: number) => void;
  }>();

  const runtimeLabel = derived(currentMovie, (m) =>
    m.runtime ? formatRuntime(m.runtime) : "-",
  );
  const yearLabel = derived(currentMovie, (m) =>
    m.year ? m.year.toString() : "-",
  );
  const countryLabel = derived(currentMovie, (m) =>
    m.country ? m.country.code : "-",
  );
  const ratingLabel = derived(currentMovie, (m) => m.rating?.toString());
</script>

<section class="extra-information" aria-label="Extra information">
  <Button
    label={$yearLabel}
    onClick={() =>
      $currentMovie.year && getMoviesByReleaseDate($currentMovie.year)}
    ariaLabel={$currentMovie.year
      ? `Release year: ${$currentMovie.year}`
      : "Release year: unknown"}
    description={$currentMovie.year
      ? `This movie's release year. Click to find another movie released in ${$currentMovie.year}.`
      : "Release year unknown."}
    disabled={!$currentMovie.year}
  />
  <Button
    label={$countryLabel}
    onClick={() =>
      $currentMovie.country && getMoviesByCountry($currentMovie.country?.code)}
    ariaLabel={$currentMovie.country
      ? `Country: ${$currentMovie.country.name}.`
      : "Country: unknown."}
    description={$currentMovie.country
      ? `This movie's country of origin. Click to find another movie from ${$currentMovie.country.name}`
      : "Country of origin unknown."}
    disabled={!$currentMovie.country}
  />
  <Button
    label={$ratingLabel}
    onClick={() =>
      $currentMovie.rating && getMoviesByRating($currentMovie.rating)}
    ariaLabel={$currentMovie.rating
      ? `TMDB rating: ${$currentMovie.rating}.`
      : "TMDB rating: not available."}
    description={$currentMovie.rating
      ? `TMDB rating: ${$currentMovie.rating}. Click to find another movie with a similar rating.`
      : "TMDB rating not available."}
    disabled={!$currentMovie.rating}
  />
  <Button
    label={$runtimeLabel}
    onClick={() =>
      $currentMovie.runtime && getMoviesByRuntime($currentMovie.runtime)}
    ariaLabel={$currentMovie.runtime
      ? `Runtime: ${$currentMovie.runtime} minutes.`
      : "Runtime: unknown."}
    description={$currentMovie.runtime
      ? `Runtime: ${$currentMovie.runtime} minutes. Click to find another movie with the same runtime.`
      : "Runtime unknown."}
    disabled={!$currentMovie.runtime}
  />
</section>

<style lang="scss">
  section {
    display: flex;
    justify-content: stretch;
    font-size: 0.75rem;
  }
</style>
