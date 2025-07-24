<script lang="ts">
    import { currentFilters } from "../stores/movie";
    import FilterYear from "./FilterYear.svelte";
</script>

<section>
    <h3>Year</h3>
    <div class="filters">
        <FilterYear
            placeholder={"From"}
            onChange={(yearValue) =>
                currentFilters.update((filters) => ({
                    ...filters,
                    yearFrom: yearValue,
                }))}
        />
        <FilterYear
            placeholder={"To"}
            onChange={(yearValue) =>
                currentFilters.update((filters) => ({
                    ...filters,
                    yearTo: yearValue,
                }))}
        />
    </div>
</section>

<style>
    section {
        display: grid;
        grid-template-columns: 1fr 6fr;
        border: var(--border-default);
    }

    h3 {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .filters {
        /* display: flex; */
    }
</style>
