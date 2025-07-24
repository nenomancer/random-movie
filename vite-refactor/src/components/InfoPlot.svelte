<script lang="ts">
    import { currentMovie } from "../stores/movie";
</script>

<section class="plot" aria-label="Plot">
    <h2 class="title">PLT</h2>
    <p class="content">
        {$currentMovie.plot ? $currentMovie.plot : "[Plot data encrypted]"}
    </p>
</section>

<style>
    .plot {
        display: flex;
        flex-direction: column;
        font: inherit;
        flex: 1;
        overflow: hidden;
        font-size: 1.1rem;
    }

    .title,
    .content {
        border: var(--border-default);
    }

    .title {
        border-bottom: none;
        text-align: center;
        /* height: var(--height-row-s); */
    }

    .content {
        display: -webkit-box;
        overflow-y: scroll;
        height: 8rem;
        padding: 0.25rem 0.5rem;
        flex: 1;
    }
</style>
