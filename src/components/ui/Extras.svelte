<script lang="ts">
  import { FILTER_DEFAULTS } from "../../lib/constants";
  import { rangePercent } from "../../lib/helpers";
  import { currentFilters } from "../../lib/stores";
  import Monitor from "../layout/Monitor.svelte";
  import Screen from "../layout/Screen.svelte";

  const { YEAR_MIN, YEAR_MAX, RATING_MIN, RATING_MAX } = FILTER_DEFAULTS;

  // Position of the highlighted part of each bar
  $: yearRange = rangePercent(
    $currentFilters?.yearFrom ?? YEAR_MIN,
    $currentFilters?.yearTo ?? YEAR_MAX,
    YEAR_MIN,
    YEAR_MAX
  );
  $: ratingRange = rangePercent(
    $currentFilters?.ratingFrom ?? RATING_MIN,
    $currentFilters?.ratingTo ?? RATING_MAX,
    RATING_MIN,
    RATING_MAX
  );
</script>

<section>
  <Monitor classes={["extras-info"]}>
    <Screen>
      <p>More information on hover</p>
    </Screen>
  </Monitor>
  <div class="extras-filters">
    <div class="screen">
      <p>{$currentFilters?.country}</p>
      <div class="genres">
        <span>[</span>
        <p class="genres-list">{$currentFilters?.genres}</p>
        <span>]</span>
      </div>
      <div class="year-bar">
        <div
          class="year-range"
          style:left="{yearRange.left}%"
          style:right="{yearRange.right}%"
        ></div>
      </div>
      <div class="rating-bar">
        <div
          class="rating-range"
          style:left="{ratingRange.left}%"
          style:right="{ratingRange.right}%"
        ></div>
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
