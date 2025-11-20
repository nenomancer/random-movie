<script lang="ts">
  import { currentHistory, currentMovie } from "../../lib/stores.js";
  export let getMovie: (id: number) => void;
  let isFlipped: boolean = false;
  // ADD "SELECTED" CLASS TO SELECTED HISTORY LOG

  function openFavorites() {
    isFlipped = true;
  }

  function openHistory() {
    isFlipped = false;
  }
</script>

<div
  class={`perspective-container ${isFlipped ? "flipped" : ""}`}
  data-selected={isFlipped}
>
  <div class="tabs">
    <button
      class="tab"
      on:click={() => (isFlipped = false)}
      data-selected={!isFlipped}>History</button
    >
  </div>
  <div class="list">
    {#each $currentHistory as log}
      <button
        class={`note ${$currentMovie.id == log.id ? "selected" : "kurac"}`}
        on:click={() => getMovie(log.id)}>{log.name}</button
      >
    {/each}
  </div>
</div>

<!-- MAYBE ADD FAVORITES / WATCHLIST ? -->

<style lang="scss">
  @use "../../styles/variables";
  @use "../../styles/mixins";
  @use "sass:color";

  .perspective-container {
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
    // width: 100%;
    flex: 1;
  }

  .tabs {
    text-orientation: mixed;
    writing-mode: vertical-rl;
    display: flex;
    // flex-direction: column;
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
    @include mixins.ui-button();
    padding-block: 0;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: flex-start;
  }

  .note.to-history,
  .note.to-favorites {
    margin-block: auto 0;
    padding-inline: 1rem;
    padding-bottom: 1rem;
    text-transform: uppercase;
  }
  .note.to-favorites {
    align-self: flex-end;
    justify-self: flex-end;
    text-align: right;

    &::before {
      content: none;
    }
  }
</style>
