<script lang="ts">
  import { activeTab, currentMovie } from "../../lib/stores";
  import { TAB_NAME } from "../../lib/constants";
  import TypedMessage from "../ui/TypedMessage.svelte";
</script>

{#if $currentMovie.poster}
  <img
    src={$currentMovie.poster}
    alt={`Poster for the movie ${$currentMovie.title.name}`}
  />
{/if}
{#if !$currentMovie.poster && $activeTab === TAB_NAME.INFO}
  <!-- Only mounted while visible, so it types out each time it appears -->
  <div class="error">
    <TypedMessage text="No image data on file." mode="plain" />
  </div>
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
