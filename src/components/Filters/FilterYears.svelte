<script lang="ts">
  import { FILTER_DEFAULTS } from "../../lib/constants";
  import {
    checkFilterEnable,
    clampToRange,
    rangePercent,
    resolveYearInput,
  } from "../../lib/helpers";
  import { currentFilters, resetFiltersSignal } from "../../lib/stores";

  const { YEAR_MIN, YEAR_MAX } = FILTER_DEFAULTS;

  // Short on-screen label ("YRS") and the full name read out by screen readers
  export let label: string = "";
  export let name: string = "";
  let yearFrom: number = YEAR_MIN;
  let yearTo: number = YEAR_MAX;

  $: fullName = name || label;
  // Position of the highlighted part of the track
  $: highlight = rangePercent(yearFrom, yearTo, YEAR_MIN, YEAR_MAX);

  function commit() {
    yearFrom = clampToRange(yearFrom, YEAR_MIN, YEAR_MAX);
    yearTo = clampToRange(yearTo, YEAR_MIN, YEAR_MAX, YEAR_MAX);

    currentFilters.update((filters) => ({ ...filters, yearFrom, yearTo }));
    checkFilterEnable();
  }

  // The handles can touch but not cross
  function setFrom(value: number) {
    yearFrom = Math.min(value, yearTo);
    commit();
  }

  function setTo(value: number) {
    yearTo = Math.max(value, yearFrom);
    commit();
  }

  // Number boxes: let people type freely, clamp when the year is complete
  // (4 digits) or on blur / Enter. See resolveYearInput.
  function typeYear(side: "from" | "to", e: Event, final: boolean) {
    const input = e.target as HTMLInputElement;
    const fallback = side === "from" ? YEAR_MIN : YEAR_MAX;
    const year = resolveYearInput(input.value, fallback, final);
    if (year === null) return; // still typing

    if (side === "from") {
      setFrom(year);
      input.value = String(yearFrom);
    } else {
      setTo(year);
      input.value = String(yearTo);
    }
  }

  function reset() {
    if (yearFrom === YEAR_MIN && yearTo === YEAR_MAX) return;
    yearFrom = YEAR_MIN;
    yearTo = YEAR_MAX;
    commit();
  }

  $: if ($resetFiltersSignal) reset();
</script>

<section>
  <div class="header">
    <span class="title">{label}</span>
    <div class="values">
      <input
        min={YEAR_MIN}
        max={YEAR_MAX}
        type="number"
        aria-label={`${fullName} from`}
        value={yearFrom}
        on:input={(e) => typeYear("from", e, false)}
        on:change={(e) => typeYear("from", e, true)}
      />

      <input
        min={YEAR_MIN}
        max={YEAR_MAX}
        type="number"
        aria-label={`${fullName} to`}
        value={yearTo}
        on:input={(e) => typeYear("to", e, false)}
        on:change={(e) => typeYear("to", e, true)}
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
      id="yearFrom"
      type="range"
      aria-label={`${fullName} from`}
      min={YEAR_MIN}
      max={YEAR_MAX}
      bind:value={yearFrom}
      on:input={() => setFrom(yearFrom)}
    />
    <input
      id="yearTo"
      type="range"
      aria-label={`${fullName} to`}
      min={YEAR_MIN}
      max={YEAR_MAX}
      bind:value={yearTo}
      on:input={() => setTo(yearTo)}
    />
  </div>
</section>

<style lang="scss">
  @use "../../styles/filters";

  @include filters.range-filter();
</style>
