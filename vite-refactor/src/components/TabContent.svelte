<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    export let name: string;
    const activeTab: Writable<string> = getContext("activeTab");
</script>

<article class={`${$activeTab !== name ? "hidden" : ""}`}>
    <slot></slot>
</article>

<style>
    .hidden {
        display: none;
    }
</style>
