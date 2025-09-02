<script lang="ts">
    import { activeTab } from "../../lib/stores.ts";
    export let name: string;
</script>

<article class={`tab-content ${$activeTab !== name ? "hidden" : ""}`}>
    <slot></slot>
</article>

<style>
    .tab-content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        height: 100%;
    }
    .hidden {
        display: none;
    }
</style>
