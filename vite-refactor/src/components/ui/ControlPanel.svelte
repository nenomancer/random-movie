<script lang="ts">
    import { DEFAULT_FILTER } from "../../lib/constants";
    import { currentFilters, useFilters } from "../../stores/movie";
    import { activeTab } from "../../stores/ui";
    import FilterEnable from "../filters/FilterEnable.svelte";

    export let fetchMovies: () => void;

    function toggleTab(tabName: string) {
        if ($activeTab != tabName) {
            activeTab.set(tabName);
        } else {
            activeTab.set("Info");
        }
    }

    function resetFilter() {
        // TODO: UI doesn't update
        currentFilters.set(DEFAULT_FILTER);
        useFilters.set(false);
    }
</script>

<!-- TODO: Export tab names as constants -->

<div class="controls-container">
    <button
        class="control-button search"
        on:click={() => fetchMovies()}
        class:active={$activeTab === "Loading"}
        style="display: block;">Search</button
    >

    <div class="controls-filters">
        <button
            class="control-button"
            on:click={() => toggleTab("Filters")}
            class:active={$activeTab === "Filters"}
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
        on:click={() => toggleTab("About")}
        class:active={$activeTab === "About"}
        style="display: block;">About</button
    >
</div>

<style lang="scss">
    @import "../../styles/mixins";
    @import "../../styles/variables";

    .controls-container {
        @include edge-bevel();
        grid-area: controls;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        row-gap: 1rem;
        background-color: $monitor-color;
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
            background-color: $monitor-color;
            color: black;
            padding-inline: 1rem;
            line-height: 1rem;
        }
    }

    .control-button {
        transition: 250ms ease-out;
        border: none;
        aspect-ratio: 1/1;
        @include control-button();
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
        aspect-ratio: unset;

        &,
        &::after {
            border-radius: 50%;
        }
    }
</style>
