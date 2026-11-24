<script lang="ts">
  import { FILTER_DEFAULTS } from "../../lib/constants";
  import type { Filters } from "../../lib/types";
  import { currentFilters } from "../../lib/stores";
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
    const minCalc = filters?.yearFrom ? filters.yearFrom - minYear : minYear;
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
  <div class="extras-filters">
    <div class="screen">
      <h4>{$currentFilters?.country}</h4>
      <div class="genres">
        <span>[</span>
        <h4 class="genres-list">{$currentFilters?.genres}</h4>
        <span>]</span>
      </div>
      <div class="year-bar">
        <div class="year-range" bind:this={yearBar}></div>
      </div>
      <div class="rating-bar">
        <div class="rating-range" bind:this={ratingBar}></div>
      </div>
    </div>
    <div class="status-lights">STATUS LIGHTS</div>
  </div>
  <div class="extras-speaker">
    <div class="speaker"></div>
    <div class="buttons">
      <span class="light"></span>
      <label for="mute">Mute Audio</label>
      <input type="checkbox" class="mute" id="mute" />
    </div>
  </div>
</section>

<style lang="scss">
  @use "../../styles/variables";
  @use "../../styles/mixins";

  section {
    grid-area: extra;
    display: grid;
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
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    height: 100%;
    padding: 1.5rem;
    font-size: 0.5rem;
    background-color: variables.$monitor-color;

    .screen {
      @include mixins.edge-inset();
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-column: span 3;
      padding: 0.25rem;
      background-color: black;

      .genres {
        display: flex;
        grid-column: span 3;
        width: 100%;
        overflow: hidden;
      }

      .genres-list {
        display: flex;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .extras-speaker {
    @include mixins.edge-bevel();
    grid-area: speaker;
    display: grid;
    grid-template-rows: 1fr min-content;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: variables.$monitor-color;

    .speaker {
      @include mixins.edge-bevel($opacity: 0.5, $blur: 0.5rem);
      height: 100%;
      border-radius: 1rem;
      background: radial-gradient(ellipse at center, black 15%, grey 70%);
      background-size: 0.25rem 0.25rem;
    }
  }

  .year-bar,
  .rating-bar {
    position: relative;
    grid-column: span 2;
    height: 5px;
    margin: 0.1rem;
    background: radial-gradient(circle, white 40%, transparent 40%);
    background-size: 2px 2px;
    background-position: 0% 45%;
  }

  .year-range,
  .rating-range {
    position: absolute;
    inset: 0;
    background: white;
  }
</style>
