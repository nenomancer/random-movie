<script lang="ts">
    import { activeTab } from "../stores/ui";
    export let name: string;
</script>

<article class={`${$activeTab !== name ? "hidden" : ""}`}>
    <slot></slot>
</article>

<style>
    .hidden {
        display: none;
    }
</style>
