<script lang="ts">
    import { FILTER_DEFAULTS } from "../../lib/constants";
    import { currentFilters } from "../../lib/stores.ts";
    import FilterYear from "./FilterYear.svelte";
    export let label: string = "";
</script>

<section>
    <h3 class="title">{label}</h3>
    <div class="filters">
        <FilterYear
            placeholder={FILTER_DEFAULTS.YEAR_MIN.toString()}
            onChange={(yearValue) =>
                currentFilters.update((filters) => ({
                    ...filters,
                    yearFrom: yearValue,
                }))}
        />
        <!-- <span>-</span> -->
        <FilterYear
            placeholder={FILTER_DEFAULTS.YEAR_MAX.toString()}
            onChange={(yearValue) =>
                currentFilters.update((filters) => ({
                    ...filters,
                    yearTo: yearValue,
                }))}
        />
    </div>
</section>

<style lang="scss">
    @use "../../styles/mixins";
    section {
        display: grid;
        grid-template-columns: 1fr 6fr;
        border: var(--border-default);
    }

    .title {
        @include mixins.ui-button();
        pointer-events: none;
        border-right: var(--border-default);
        font-weight: bold;
    }

    .filters {
        display: flex;
        /* gap: 1rem; */
    }
</style>
