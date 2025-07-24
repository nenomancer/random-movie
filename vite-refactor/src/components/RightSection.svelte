<script lang="ts">
    import { currentHistory } from "../stores/history";
    import { currentMovie } from "../stores/movie";
    import FilterEnable from "./FilterEnable.svelte";
    import InfoPoster from "./InfoPoster.svelte";
    import Monitor from "./Monitor.svelte";
    import Screen from "./Screen.svelte";
    import TabContent from "./TabContent.svelte";
    export let fetchMovies: () => void;
    export let getMovie: (movieId: number) => void;
</script>

<!-- <div class="section"> -->
<Monitor classes={["poster"]}>
    <Screen>
        <TabContent name="Info">
            <InfoPoster />
        </TabContent>
        <TabContent name="Loading">Loading...</TabContent>
        <TabContent name="Error">Error!!!</TabContent>
        <TabContent name="About">About moi and then some</TabContent>
    </Screen>
</Monitor>
<div class="two">
    <button on:click={() => fetchMovies()}>CLICK ME</button>

    <FilterEnable />
    <div>
        {#each $currentHistory as log}
            <button on:click={() => getMovie(log.id)}>{log.name}</button>
        {/each}
    </div>
</div>

<!-- </div> -->

<style>
    /* .section {
        display: grid;
        grid-template-rows: 1fr 0.6fr;

        @media screen and (max-width: 600px) {
            grid-template-rows: 1fr;
            grid-template-columns: 1fr 0.6fr;
        }
    }

    .two {
        border: var(--border-default);
        grid-area: controls;
    } */
</style>
