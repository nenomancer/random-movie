<script lang="ts">
    import { currentFilters } from "../stores/movie";
    import FilterYear from "./FilterYear.svelte";
</script>

<section>
    <label for="year-from">Year</label>
    <div>
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
