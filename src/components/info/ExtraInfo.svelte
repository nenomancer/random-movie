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
    ariaLabel={`Release year: ${$currentMovie.year}`}
    description={`This movie's release year. Click to find another movie released in ${$currentMovie.year}.`}
  />
  <Button
    label={$countryLabel}
    onClick={() =>
      $currentMovie.country && getMoviesByCountry($currentMovie.country?.code)}
    ariaLabel={`Country: ${$currentMovie.country?.name}.`}
    description={`This movie's country of origin. Click to find another movie from ${$currentMovie.country?.name}`}
  />
  <Button
    label={$ratingLabel}
    onClick={() =>
      $currentMovie.rating && getMoviesByRating($currentMovie.rating)}
    ariaLabel={`TMDB rating: ${$currentMovie.rating}.`}
    description={`TMDB rating: ${$currentMovie.rating}. Click to find another movie with a similar rating.`}
    disabled={!$currentMovie.rating}
  />
  <Button
    label={$runtimeLabel}
    onClick={() => getMoviesByRuntime($currentMovie.runtime!)}
    ariaLabel={"getRuntimeAria()"}
    description={"getRuntimeDescription()"}
  />
</section>

<style lang="scss">
  section {
    display: flex;
    justify-content: stretch;
    font-size: 0.75rem;
    button {
      padding: 200px;
    }
  }
</style>
