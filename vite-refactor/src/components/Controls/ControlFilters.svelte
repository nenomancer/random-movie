<script lang="ts">
    import { DEFAULT_FILTER } from "../../lib/constants";
    import { currentFilters, useFilters } from "../../stores/movie";
    import { activeTab } from "../../stores/ui";
    import FilterEnable from "../Filters/FilterEnable.svelte";

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
        // box-shadow:
        //     inset 0 0 2px 4px hsl(0, 100%, 0%),
        //     0 4px 3px 0 hsla(0, 0%, 0%, 0.6),
        //     0 0 1px 1px rgba(255, 255, 255, 0.4),
        //     -1px -1px 1px 0 hsla(0, 0%, 0%, 0.425);

        // background-color: grey;
        // position: relative;

        // &::after {
        //     content: "";
        //     inset: 0.5rem;
        //     inset: 2px;
        //     position: absolute;

        //     box-shadow:
        //         2px 2px 4px 2px rgba(0, 0, 0, 0.4),
        //         -2px -2px 4px 2px rgba(255, 255, 255, 0.4),
        //         inset 0.5px 0.5px 1px 0 rgba(0, 0, 0, 0.65),
        //         inset -0.5px -0.5px 1px 0 rgba(255, 255, 255, 0.3);
        //     background: linear-gradient(
        //         125deg,
        //         rgba(255, 255, 255, 0.75),
        //         rgba(255, 255, 255, 0)
        //     );
        //     border: 4px outset rgb(160, 160, 160);
        // }

        // &.active,
        // &:active {
        //     box-shadow:
        //         inset 0 0 3px 4px hsl(0, 100%, 0%),
        //         0 1px 1px 0 hsla(0, 0%, 0%, 0.6),
        //         0 0 1px 1px rgba(255, 255, 255, 0.4),
        //         -1px -1px 1px 0 hsla(0, 0%, 0%, 0.425);

        //     &::after {
        //         box-shadow:
        //             2px 2px 4px 2px rgba(0, 0, 0, 0.4),
        //             -2px -2px 4px 2px rgba(255, 255, 255, 0.4),
        //             inset 0.5px 0.5px 1px 0 rgba(0, 0, 0, 0.65),
        //             inset -0.5px -0.5px 1px 0 rgba(255, 255, 255, 0.3);
        //         background: linear-gradient(
        //             125deg,
        //             rgba(255, 255, 255, 0.5),
        //             rgba(255, 255, 255, 0)
        //         );
        //         border: 4px outset rgb(120, 120, 120);
        //     }
        // }
    }

    .control-button-reset {
        // background-color: purple;
    }

    .control-button.search {
        aspect-ratio: unset;
    }

    .control-button.about {
        // width: 40%;
        width: 20%;

        &,
        &::after {
            border-radius: 50%;
        }
    }
</style>
