<script lang="ts">
    import { DEFAULT_FILTER, TAB_NAME } from "../../lib/constants";
    import { activeTab, currentFilters, useFilters } from "../../lib/stores.ts";
    import FilterEnable from "../filters/FilterEnable.svelte";

    export let fetchMovies: () => void;

    function toggleTab(tabName: string) {
        if ($activeTab != tabName) {
            activeTab.set(tabName);
        } else {
            activeTab.set(TAB_NAME.INFO);
        }
    }

    function resetFilter() {
        // TODO: UI doesn't update
        currentFilters.set(DEFAULT_FILTER);
        useFilters.set(false);
    }
</script>

<div class="controls-container">
    <button
        class="control-button search"
        on:click={() => fetchMovies()}
        class:active={$activeTab === TAB_NAME.LOADING}
        disabled={$activeTab === TAB_NAME.LOADING}
        style="display: block;">Search</button
    >

    <div class="controls-filters">
        <button
            class="control-button"
            on:click={() => toggleTab(TAB_NAME.FILTERS)}
            class:active={$activeTab === TAB_NAME.FILTERS}
            style="display: block;">Set</button
        >
        <FilterEnable />

        <button
            class="control-button control-button-reset"
            on:click={resetFilter}
            style="display: block;">Reset</button
        >
    </div>
    <button
        class="control-button about"
        on:click={() => toggleTab(TAB_NAME.ABOUT)}
        class:active={$activeTab === TAB_NAME.ABOUT}
        style="display: block;">About</button
    >
</div>

<style lang="scss">
    @use "../../styles/mixins";
    @use "../../styles/variables";

    .controls-container {
        @include mixins.edge-bevel();
        grid-area: controls;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        row-gap: 1rem;
        background-color: variables.$monitor-color;
    }

    .controls-filters {
        // display: flex;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        border: 1px solid white;
        border-bottom: none;
        padding-top: 1rem;
        padding-inline: 0.5rem;
        // margin-block: 0.5rem;
        position: relative;

        &::before {
            content: "filterszz";
            position: absolute;
            top: -0.5rem;
            left: 50%;
            translate: -50% 0;
            background-color: variables.$monitor-color;
            color: black;
            padding-inline: 1rem;
            line-height: 1rem;
        }
    }

    .control-button {
        @include mixins.control-button();
        transition: 250ms ease-out;
        border: none;
    }

    .control-button-reset {
        // background-color: purple;
    }

    .control-button.search {
        aspect-ratio: unset;
        padding-block: 1rem;
    }

    .control-button.about {
        // width: 20%;
        // aspect-ratio: unset;

    }
</style>
