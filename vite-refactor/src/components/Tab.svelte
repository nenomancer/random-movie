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
    <button on:click={setActiveTab}>Show {name}</button>
{/if}
