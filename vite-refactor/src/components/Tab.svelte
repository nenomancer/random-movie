<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    export let name: string;
    export let closeDropdowns: () => void;

    const activeTab: Writable<string> = getContext("activeTab");

    function setActiveTab() {
        activeTab.set(name);
        closeDropdowns();
    }
</script>

<button on:click={setActiveTab}>Show {name}</button>
