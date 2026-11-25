<script lang="ts">
  import { currentMovie } from "../../lib/stores";
</script>

<section aria-labelledby="title" class="row">
  <h1 class="title" id="title">
    {#if $currentMovie.title.imdb}
      <a
        href={$currentMovie.title.imdb}
        data-info={``}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open IMDb page for ${$currentMovie.title.name} in a new tab`}
      >
        {$currentMovie.title.name}
      </a>
    {:else}
      <span class="name">{$currentMovie.title.name}</span>
    {/if}
  </h1>
</section>

<style lang="scss">
  @use "../../styles/mixins";
  .title {
    display: flex;
    overflow-x: auto;
    justify-content: start;
    align-items: stretch;
    font-size: 2rem;
    font-weight: 400;
  }

  // The title as a link, or plain text when there is no IMDb page. Both get the
  // same padding so the text doesn't jump between the two.
  .title a {
    @include mixins.ui-button();
    flex: 1;
  }

  .title .name {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding-inline: 0.5rem;
    padding-block: 0.4rem;
    white-space: nowrap;
  }
</style>
