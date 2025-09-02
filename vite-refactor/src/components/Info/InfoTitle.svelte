<script lang="ts">
    import { currentMovie } from "../../lib/stores.ts";
</script>

<section aria-labelledby="title" class="row">
    <!-- <h2 class="label">TTL</h2> -->
    <h1 class="title">
        <a
            href={$currentMovie.title.imdb}
            data-info={``}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open IMDb page for ${
                $currentMovie.title.name
            } in a new tab`}
        >
            {$currentMovie.title.name}
        </a>
    </h1>
</section>

<style>
    section {
        /* height: var(--height-row); */
        align-items: center;
    }

    /* .label, */
    .title {
        display: flex;
        overflow-x: scroll;
        /* border: var(--border-default); */
        color: var(--color-highlight);
        justify-content: start;
        align-items: stretch;
        /* height: 100%; */
        display: flex;
        font-size: 2rem;
        font-weight: 400;
    }

    /* .label {
        border-right: none;
    } */
    /* 
    .title {
        justify-content: start;
        align-items: stretch;
        height: 100%;
        display: flex;
    } */

    .title a {
        white-space: nowrap;
        padding-inline: 0.5rem;
        transition: all var(--anim-default);
        display: flex;
        align-items: center;
        flex: 1;
        padding-block: 0.25rem;
        justify-content: center;
    }

    .title a:hover,
    .title a:focus-visible {
        color: var(--color-dark);
        background-color: var(--color-highlight);
    }

    section {
        /* display: grid;
        grid-template-columns: 1fr 6fr; */
        /* grid-template-rows: 2rem; */
    }

    /* duplcicate code  */
</style>
