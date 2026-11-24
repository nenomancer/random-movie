<script lang="ts">
  import { TAB_NAME } from "../../lib/constants";
  import { resetFilters } from "../../lib/helpers";
  import { activeTab, useFilters } from "../../lib/stores";

  export let fetchMovies: () => void;

  function toggleTab(tabName: string) {
    if ($activeTab != tabName) {
      activeTab.set(tabName);
    } else {
      activeTab.set(TAB_NAME.INFO);
    }
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
      aria-label="Find a random movie"
      on:click={() => fetchMovies()}
      class:active={$activeTab === TAB_NAME.LOADING}
      disabled={$activeTab === TAB_NAME.LOADING}
    ></button>
    <button
      class="control-button about"
      aria-label="About this site"
      aria-pressed={$activeTab === TAB_NAME.ABOUT}
      on:click={() => toggleTab(TAB_NAME.ABOUT)}
      class:active={$activeTab === TAB_NAME.ABOUT}
    ></button>
  </div>
  <div class="controls-filters">
    <button
      class="control-button set"
      aria-label="Filter settings"
      aria-pressed={$activeTab === TAB_NAME.FILTERS}
      on:click={() => toggleTab(TAB_NAME.FILTERS)}
      class:active={$activeTab === TAB_NAME.FILTERS}
    ></button>
    <div class="control-button use">
      <input
        type="checkbox"
        id="useFilters"
        aria-label="Use filters"
        on:change={(event) => handleCheck(event)}
        on:keydown={(event) => handleEnter(event)}
        bind:checked={$useFilters}
      />
    </div>

    <button
      class="control-button reset"
      aria-label="Reset filters"
      on:click={resetFilters}
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
      aspect-ratio: unset;
      padding-block: 1rem;
      outline-offset: -0.5rem;
      @include mixins.control-button($content: "Search", $state: "class");
    }
    &.about {
      @include mixins.control-button-lightable($content: "About", $state: "class");
    }

    &.set {
      @include mixins.control-button-lightable($content: "Set", $state: "class");
    }
    &.use {
      @include mixins.control-button-lightable($content: "Enable", $state: "checkbox");
    }

    &.reset {
      @include mixins.control-button($content: "Reset", $state: "none");
    }
  }
</style>
