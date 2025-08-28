<script lang="ts">
    import { FILTER_DEFAULTS } from "../../lib/constants";
    import type { Filters } from "../../lib/types";
    import { currentFilters } from "../../stores/movie";
    import Monitor from "../layout/Monitor.svelte";
    import Screen from "../layout/Screen.svelte";

    let yearBar: HTMLElement;
    let ratingBar: HTMLElement;

    const minYear = FILTER_DEFAULTS.YEAR_MIN;
    const maxYear = FILTER_DEFAULTS.YEAR_MAX;
    const totalYearSpan = maxYear - minYear;

    const minRating = FILTER_DEFAULTS.RATING_MIN;
    const maxRating = FILTER_DEFAULTS.RATING_MAX;
    const totalRatingSpan = maxRating - minRating;

    function calculateRatingPercentage(filters: Filters) {
        const minCalc = filters?.ratingFrom
            ? filters.ratingFrom - minRating
            : minRating;
        const maxCalc = filters?.ratingTo ? filters.ratingTo : maxRating;
        const fromPercent = (minCalc / totalRatingSpan) * 100;

        const toPercent = ((maxRating - maxCalc) / totalRatingSpan) * 100;

        if (ratingBar) {
            ratingBar.style.left = fromPercent + "%";
            ratingBar.style.right = toPercent + "%";
        }
    }

    function calculateYearPercentage(filters: Filters) {
        const minCalc = filters?.yearFrom
            ? filters.yearFrom - minYear
            : minYear;
        const maxCalc = filters?.yearTo ? filters.yearTo : maxYear;
        const fromPercent = (minCalc / totalYearSpan) * 100;

        const toPercent = ((maxYear - maxCalc) / totalYearSpan) * 100;

        if (yearBar) {
            yearBar.style.left = fromPercent + "%";
            yearBar.style.right = toPercent + "%";
        }
    }

    $: {
        const filters = $currentFilters; // auto-subscribe with $
        calculateYearPercentage(filters);
        calculateRatingPercentage(filters);
    }
</script>

<section>
    <Monitor classes={["extras-info"]} padding={1.5}>
        <Screen>
            <p>More information on hover</p>
        </Screen>
    </Monitor>
    <!-- <Monitor classes={["extras-filters"]} padding={0.5}> -->
    <div class="extras-filters">
        <div class="screen">
            <h4>{$currentFilters?.country}</h4>
            <div class="genres">
                <span>[</span>
                <h4 class="genres-list">{$currentFilters?.genres}</h4>
                <span>]</span>
            </div>
            <!-- <div> -->
            <div class="year-bar">
                <div class="year-range" bind:this={yearBar}></div>
            </div>
            <div class="rating-bar">
                <div class="rating-range" bind:this={ratingBar}></div>
            </div>
            <!-- </div> -->
        </div>
        <div>asdasd</div>
    </div>
    <!-- </Monitor> -->
    <div class="extras-speaker">
        <div class="speaker">SPEAKR</div>
        <div class="buttons">
            <span class="light"></span>
            <button>Mute</button>
        </div>
    </div>
</section>

<style lang="scss">
    @use "../../styles/variables";
    @use "../../styles/mixins";

    section {
        // @include mixins.edge-bevel();
        grid-area: extra;
        // background: variables.$monitor-color;
        display: grid;
        // padding: 1rem;
        gap: 0.25rem;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
        grid-template-areas:
            "info info speaker speaker"
            "info info speaker speaker"
            "info info speaker speaker"
            "filters filters speaker speaker";
    }

    .extras-info {
        grid-area: info;
    }
    .extras-filters {
        @include mixins.edge-bevel();
        grid-area: filters;
        display: flex;
        height: 100%;
        background-color: variables.$monitor-color;

        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
        font-size: 0.5rem;
        padding: 1.5rem;
        .screen {
            @include mixins.edge-inset();
            display: grid;
            flex: 1;
            grid-template-columns: repeat(4, 1fr);
            background-color: black;
            grid-column: span 3;
            padding: 0.25rem;
            .genres {
                overflow: hidden;
                grid-column: span 3;
                display: flex;
                width: 100%;
            }

            .genres-list {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                display: flex;
            }
        }
    }
    .extras-speaker {
        grid-area: speaker;
        background-color: red;
        display: grid;
        grid-template-rows: 1fr min-content;
        .speaker {
            background-color: blue;
            border-radius: 50%;
        }
    }

    .year-bar,
    .rating-bar {
        position: relative;
        // width: 120px;
        height: 5px;
        grid-column: span 2;
        margin: 0.1rem;
        background-repeat: repeat;
        background: radial-gradient(circle, white 40%, transparent 40%);
        background-size: 2px 2px;
        background-position: 0% 45%;
    }

    .year-range,
    .rating-range {
        content: "";
        height: 5px;

        inset: 0;
        position: absolute;
        height: 100%;
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        background: white;
    }
</style>
