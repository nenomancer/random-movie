<script lang="ts">
  import { currentHistory, currentMovie } from "../../lib/stores";
  export let getMovie: (id: number) => void;
  let isFlipped: boolean = false;
</script>

<div class="history-container">
  <div class="tabs">
    <button
      class="tab"
      on:click={() => (isFlipped = false)}
      data-selected={!isFlipped}
    >
      History
    </button>
  </div>
  <div class="list">
    {#each $currentHistory as log}
      <button
        class="note"
        class:selected={$currentMovie.id == log.id}
        aria-current={$currentMovie.id == log.id ? "true" : undefined}
        on:click={() => getMovie(log.id)}
      >
        {log.name}
      </button>
    {/each}
  </div>
</div>

<!-- MAYBE ADD FAVORITES / WATCHLIST ? -->

<style lang="scss">
  @use "../../styles/variables";
  @use "../../styles/mixins";

  .history-container {
    display: flex;
    height: 100%;
  }

  .list {
    display: flex;
    flex-direction: column-reverse;
    justify-content: start;
    overflow: hidden;
    border: variables.$border-default;
    border-left: none;
    flex: 1;
  }

  .tabs {
    text-orientation: mixed;
    writing-mode: vertical-rl;
    display: flex;
  }
  .tab {
    background-color: transparent;
    border: none;
    text-align: center;
    flex: 1;
    color: variables.$ui-color-foreground;

    &[data-selected="true"] {
      border: variables.$border-default;
    }
  }

  .note {
    @include mixins.ui-button($selected: true);

    padding-block: 0;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: flex-start;
  }
</style>
