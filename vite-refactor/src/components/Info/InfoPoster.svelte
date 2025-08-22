<script lang="ts">
    import { currentMovie } from "../../stores/movie";
</script>

{#if $currentMovie.poster}
    <img
        src={$currentMovie.poster}
        alt={`Poster for the movie ${$currentMovie.title}`}
    />
{/if}
{#if !$currentMovie.poster}
    <p>Image data corrupted.</p>
{/if}

<style>
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>
