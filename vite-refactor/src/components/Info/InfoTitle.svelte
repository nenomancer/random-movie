<script lang="ts">
    import { currentMovie } from "../../lib/stores";
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

<style lang="scss">
    @use "../../styles/mixins";
    .title {
        display: flex;
        overflow-x: scroll;

        justify-content: start;
        align-items: stretch;
        display: flex;
        font-size: 2rem;
        font-weight: 400;
    }

    .title a {
        @include mixins.ui-button();
        padding-inline: 0.5rem;
        flex: 1;
    }
</style>
