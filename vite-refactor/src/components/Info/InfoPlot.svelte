<script lang="ts">
    import { currentMovie } from "../../lib/stores.ts";
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

        border: var(--border-default);
    }

    .title,
    .content {
        /* border: var(--border-default); */
    }

    .title {
        border-bottom: none;
        text-align: center;
        border-bottom: var(--border-default);

        font-weight: bold;
    }

    .content {
        display: -webkit-box;
        overflow-y: scroll;
        height: 8rem;
        padding: 0.25rem 0.5rem;
        flex: 1;
        hyphens: auto;
    }
</style>
