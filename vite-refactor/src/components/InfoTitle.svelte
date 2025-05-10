<script lang="ts">
    import { currentMovie } from "../stores/movie";
</script>

<section aria-labelledby="title" class="row">
    <h2 class="label">TTL</h2>
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
    .label,
    .title a {
        border: 2px solid black;
        padding: 4px;
        white-space: nowrap;
    }

    .title {
        display: flex;
    }

    .label {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    section {
        background-color: grey;
        display: grid;
        grid-template-columns: 1fr 6fr;
        grid-template-rows: 2rem;
    }
</style>
