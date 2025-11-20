<script lang="ts">
    import { activeTab } from "../../lib/stores.ts";
    export let name: string;
</script>

<article class={`tab-content ${$activeTab !== name ? "hidden" : ""}`}>
    <slot></slot>
</article>

<style lang="scss">
    @use "../../styles/variables";
    .tab-content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        height: 100%;
        color: variables.$ui-color-foreground;
    }
    .hidden {
        display: none;
    }
</style>
