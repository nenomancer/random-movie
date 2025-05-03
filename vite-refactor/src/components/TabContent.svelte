<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    export let name: string;
    const activeTab: Writable<string> = getContext("activeTab");
</script>

{#if $activeTab === name}
    <article class="content">
        <slot></slot>
    </article>
{/if}
