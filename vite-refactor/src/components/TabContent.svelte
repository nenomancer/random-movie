<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    export let name: string;
    const activeTab: Writable<string> = getContext("activeTab");
</script>

{#if $activeTab === name}
    <div class="content">
        <slot></slot>
    </div>
{/if}
