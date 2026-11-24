<script lang="ts">
  import { currentMovie } from "../../lib/stores";
</script>

{#if $currentMovie.poster}
  <img
    src={$currentMovie.poster}
    alt={`Poster for the movie ${$currentMovie.title.name}`}
  />
{/if}
{#if !$currentMovie.poster}
  <p class="error sys-msg">No image data on file.</p>
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
