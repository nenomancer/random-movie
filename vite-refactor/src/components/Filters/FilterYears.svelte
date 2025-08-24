<script lang="ts">
    import { RELEASE_YEAR_MAX, RELEASE_YEAR_MIN } from "../../lib/constants";
    import { currentFilters } from "../../stores/movie";
    import FilterYear from "./FilterYear.svelte";
</script>

<section>
    <h3>Year</h3>
    <div class="filters">
        <FilterYear
            placeholder={RELEASE_YEAR_MIN.toString()}
            onChange={(yearValue) =>
                currentFilters.update((filters) => ({
                    ...filters,
                    yearFrom: yearValue,
                }))}
        />
        <span>-</span>
        <FilterYear
            placeholder={RELEASE_YEAR_MAX.toString()}
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
        grid-template-columns: 5rem 6fr;
        border: var(--border-default);
    }

    h3 {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .filters {
        display: flex;
        gap: 1rem;

    }
</style>
