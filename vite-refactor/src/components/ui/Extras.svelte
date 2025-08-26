<script lang="ts">
    import { currentFilters } from "../../stores/movie";
</script>

<section>
    <h4>country: {$currentFilters?.country}</h4>
    <h4>genres: {$currentFilters?.genres}</h4>
</section>

<style lang="scss">
    @use "../../styles/variables";
    @use "../../styles/mixins";

    section {
        @include mixins.edge-bevel();
        grid-area: extra;
        background: variables.$monitor-color;
    }
</style>
