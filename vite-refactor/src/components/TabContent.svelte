<script lang="ts">
    import { activeTab } from "../stores/ui";
    export let name: string;
</script>

<article class={`tab-content ${$activeTab !== name ? "hidden" : ""}`}>
    <slot></slot>
</article>

<style>
    .tab-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        height: 100%;
    }
    .hidden {
        display: none;
    }
</style>
