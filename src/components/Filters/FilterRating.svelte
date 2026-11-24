<script lang="ts">
  import { FILTER_DEFAULTS } from "../../lib/constants";
  import {
    checkFilterEnable,
    clampToRange,
    rangePercent,
  } from "../../lib/helpers";
  import { resetFiltersSignal } from "../../lib/stores";

  const { RATING_MIN, RATING_MAX } = FILTER_DEFAULTS;

  // Short on-screen label ("RTG") and the full name read out by screen readers
  export let label: string = "";
  export let name: string = "";
  export let onChange: (from: number, to: number) => void;
  let ratingFrom: number = RATING_MIN;
  let ratingTo: number = RATING_MAX;

  $: fullName = name || label;
  // Position of the highlighted part of the track
  $: highlight = rangePercent(ratingFrom, ratingTo, RATING_MIN, RATING_MAX);

  function commit() {
    ratingFrom = clampToRange(ratingFrom, RATING_MIN, RATING_MAX);
    ratingTo = clampToRange(ratingTo, RATING_MIN, RATING_MAX, RATING_MAX);

    onChange(ratingFrom, ratingTo);
    checkFilterEnable();
  }

  // The handles can touch but not cross
  function setFrom(value: number) {
    ratingFrom = Math.min(value, ratingTo);
    commit();
  }

  function setTo(value: number) {
    ratingTo = Math.max(value, ratingFrom);
    commit();
  }

  function reset() {
    if (ratingFrom === RATING_MIN && ratingTo === RATING_MAX) return;
    ratingFrom = RATING_MIN;
    ratingTo = RATING_MAX;
    commit();
  }

  $: if ($resetFiltersSignal) reset();
</script>

<section>
  <div class="header">
    <span class="title">{label}</span>

    <div class="values">
      <input
        type="number"
        aria-label={`${fullName} from`}
        min={RATING_MIN}
        max={RATING_MAX}
        step="0.1"
        bind:value={ratingFrom}
        on:input={() => setFrom(ratingFrom)}
      />
      <input
        type="number"
        aria-label={`${fullName} to`}
        min={RATING_MIN}
        max={RATING_MAX}
        step="0.1"
        bind:value={ratingTo}
        on:input={() => setTo(ratingTo)}
      />
    </div>
  </div>
  <div class="ranges">
    <div class="range-track-bg"></div>
    <div
      class="range-track"
      style:left="{highlight.left}%"
      style:right="{highlight.right}%"
    ></div>
    <input
      id="ratingFrom"
      type="range"
      aria-label={`${fullName} from`}
      min={RATING_MIN}
      max={RATING_MAX}
      step="0.1"
      bind:value={ratingFrom}
      on:input={() => setFrom(ratingFrom)}
    />
    <input
      id="ratingTo"
      type="range"
      aria-label={`${fullName} to`}
      min={RATING_MIN}
      max={RATING_MAX}
      step="0.1"
      bind:value={ratingTo}
      on:input={() => setTo(ratingTo)}
    />
  </div>
</section>

<style lang="scss">
  @use "../../styles/filters";

  @include filters.range-filter();
</style>
