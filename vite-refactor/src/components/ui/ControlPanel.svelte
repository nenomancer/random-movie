<script lang="ts">
  import { DEFAULT_FILTER, TAB_NAME } from "../../lib/constants";
  import {
    activeTab,
    currentFilters,
    resetFiltersSignal,
    useFilters,
  } from "../../lib/stores.ts";

  import FilterEnable from "../filters/FilterEnable.svelte";

  export let fetchMovies: () => void;

  function toggleTab(tabName: string) {
    if ($activeTab != tabName) {
      activeTab.set(tabName);
    } else {
      activeTab.set(TAB_NAME.INFO);
    }
  }

  function resetFilter() {
    // TODO: UI doesn't update
    currentFilters.set(DEFAULT_FILTER);
    useFilters.set(false);
    resetFiltersSignal.set(true);
    setTimeout(() => resetFiltersSignal.set(false));
  }

  function handleCheck(event: Event) {
    const target = event.target as HTMLInputElement;
    useFilters.set(target.checked);
  }

  function handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      const target = event.target as HTMLInputElement;
      target.checked = !target.checked;
      handleCheck(event);
    }
  }
</script>

<div class="controls-container">
  <div class="controls-main">
    <button
      class="control-button search"
      on:click={() => fetchMovies()}
      class:active={$activeTab === TAB_NAME.LOADING}
      disabled={$activeTab === TAB_NAME.LOADING}
    ></button>
    <button
      class="control-button about"
      on:click={() => toggleTab(TAB_NAME.ABOUT)}
      class:active={$activeTab === TAB_NAME.ABOUT}
      style="display: block;"
    ></button>
  </div>
  <div class="controls-filters">
    <button
      class="control-button set"
      on:click={() => toggleTab(TAB_NAME.FILTERS)}
      class:active={$activeTab === TAB_NAME.FILTERS}
    ></button>
    <!-- <FilterEnable /> -->
    <div class="control-button use">
      <input
        type="checkbox"
        id="useFilters"
        on:change={(event) => handleCheck(event)}
        on:keydown={(event) => handleEnter(event)}
        bind:checked={$useFilters}
      />
    </div>

    <button
      class="control-button reset"
      on:click={resetFilter}
      style="display: block;"
    ></button>
  </div>
</div>

<style lang="scss">
  @use "../../styles/mixins";
  @use "../../styles/variables";
  @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

  .controls-container {
    @include mixins.monitor-edge();

    grid-area: controls;
    display: flex;
    flex-direction: column;
    display: grid;
    padding: 1.5rem;
    background-color: variables.$monitor-color;
  }

  .controls-main {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 0.25rem;
  }

  .controls-filters {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: variables.$border-default;
    border-color: black;
    padding: 1rem;
    margin-top: 1.5rem;
    gap: 0.25rem;
    position: relative;
    flex: 1;

    .control-button {
      @include mixins.control-button();
    }

    &::before {
      content: "FILTERS";
      font-family: "Inter";
      position: absolute;
      top: -0.5rem;
      left: 50%;
      translate: -50% 0;
      background-color: variables.$monitor-color;
      color: black;
      padding-inline: 1rem;
      line-height: 1rem;
    }
  }

  .control-button {
    border: none;
    flex: 1;

    input {
      position: absolute;
      inset: 0;
      appearance: none;
    }

    &.search {
      // background-color: darkgreen;
      aspect-ratio: unset;
      padding-block: 1rem;
      // outline: 2px solid black;
      outline-offset: -0.5rem;
      @include mixins.control-button($content: "Search");
    }
    &.about {
      @include mixins.control-button($content: "About");
    }

    &.set {
      @include mixins.control-button($content: "Set");
    }
    &.use {
      @include mixins.control-button($content: "Enable");
    }

    &.reset {
      // background-color: purple;
      @include mixins.control-button($content: "Reset");
    }
  }
</style>
