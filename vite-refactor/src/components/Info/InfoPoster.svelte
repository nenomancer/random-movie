<script lang="ts">
  import { currentMovie } from "../../lib/stores.ts";
</script>

{#if $currentMovie.poster}
  <img
    src={$currentMovie.poster}
    alt={`Poster for the movie ${$currentMovie.title}`}
  />
{/if}
{#if !$currentMovie.poster}
  <p class="error">Image data corrupted.</p>
{/if}

<style>
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    mix-blend-mode: lighten;
    filter: brightness(0.75);
  }

  .error {
    align-self: center;
  }
</style>
