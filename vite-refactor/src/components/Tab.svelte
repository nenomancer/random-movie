<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { activeTab, openDropdown } from "../stores/ui";

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

<style>
    .tab {
        flex: 1;
        border-radius: 0;
        border: var(--border-default);
        border-left: none;
    }

    .tab:hover,
    .tab:focus-visible {
        cursor: pointer;
        background-color: var(--color-highlight);
        color: var(--color-dark);
        outline: none;
    }

    .tab.active {
        background-color: var(--color-highlight);
        color: var(--color-dark);
    }

    .tab:first-child {
        border-left: var(--border-default);
    }
</style>
