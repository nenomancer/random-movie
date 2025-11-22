<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import { activeTab, openDropdown } from "../../lib/stores.ts";

  export let name: string;

  // const activeTab: Writable<string> = getContext("activeTab");

  function setActiveTab() {
    activeTab.set(name);
    openDropdown.set("");
  }
</script>

{#if name}
  <button
    class={`tab ${$activeTab === name && "active"}`}
    on:click={setActiveTab}>Show {name}</button
  >
{/if}

<style lang="scss">
  @use "../../styles/variables";
  .tab {
    flex: 1;
    border-radius: 0;
    border: variables.$border-default;
    border-left: none;
  }

  .tab:hover,
  .tab:focus-visible {
    cursor: pointer;
    background-color: variables.$ui-color-foreground;
    color: var(--color-dark);
    outline: none;
  }

  .tab.active {
    background-color: variables.$ui-color-foreground;
    color: var(--color-dark);
  }

  .tab:first-child {
    border-left: variables.$border-default;
  }
</style>
