<script lang="ts">
  import { FILTER_DEFAULTS } from "../../lib/constants";
  import { checkFilterEnable, resolveYearInput } from "../../lib/helpers";
  import { currentFilters, resetFiltersSignal } from "../../lib/stores";
  export let label: string = "";
  let yearFrom: number = FILTER_DEFAULTS.YEAR_MIN;
  let yearTo: number = FILTER_DEFAULTS.YEAR_MAX;
  let sliderTrack: HTMLElement;
  let sliderBg: HTMLElement;
  let minGap = 0;
  function onChange(from: number, to: number) {
    currentFilters.update((filters) => ({
      ...filters,
      yearFrom: from,
      yearTo: to,
    }));
  }

  function handleOnChange() {
    yearFrom = isNaN(yearFrom)
      ? FILTER_DEFAULTS.YEAR_MIN
      : Math.min(
          Math.max(yearFrom, FILTER_DEFAULTS.YEAR_MIN),
          FILTER_DEFAULTS.YEAR_MAX,
        );

    yearTo = isNaN(yearTo)
      ? FILTER_DEFAULTS.YEAR_MAX
      : Math.min(
          Math.max(yearTo, FILTER_DEFAULTS.YEAR_MIN),
          FILTER_DEFAULTS.YEAR_MAX,
        );
    onChange(yearFrom, yearTo);
    // const percent1 = (yearFrom / 10) * 100;
    const percent1 =
      ((yearFrom - FILTER_DEFAULTS.YEAR_MIN) /
        (FILTER_DEFAULTS.YEAR_MAX - FILTER_DEFAULTS.YEAR_MIN)) *
      100;
    // const percent2 = 100 - (yearTo / 10) * 100;
    const percent2 =
      ((FILTER_DEFAULTS.YEAR_MAX - yearTo) /
        (FILTER_DEFAULTS.YEAR_MAX - FILTER_DEFAULTS.YEAR_MIN)) *
      100;

    // TODO: make sure colors use variables
    sliderBg.style.left = `${percent1}%`;
    sliderBg.style.right = `${percent2}%`;
    checkFilterEnable();
  }

  // Number boxes: let people type freely, clamp when the year is complete
  // (4 digits) or on blur / Enter. See resolveYearInput.
  function typeYear(side: "from" | "to", e: Event, commit: boolean) {
    const input = e.target as HTMLInputElement;
    const fallback =
      side === "from" ? FILTER_DEFAULTS.YEAR_MIN : FILTER_DEFAULTS.YEAR_MAX;
    const year = resolveYearInput(input.value, fallback, commit);
    if (year === null) return; // still typing

    if (side === "from") {
      setFrom(year);
      input.value = String(yearFrom);
    } else {
      setTo(year);
      input.value = String(yearTo);
    }
  }

  function setFrom(value: number) {
    if (value > yearTo - minGap) {
      yearFrom = yearTo - minGap;
    } else {
      yearFrom = value;
    }

    handleOnChange();
  }

  function slideOne(e: any) {
    setFrom(parseFloat(e.target.value));
  }

  function setTo(value: number) {
    if (value < yearFrom + minGap) {
      yearTo = yearFrom + minGap;
    } else {
      yearTo = value;
    }
    handleOnChange();
  }

  function slideTwo(e: any) {
    setTo(parseFloat(e.target.value));
  }

  $: resetFiltersSignal.subscribe(() => {
    if (
      yearFrom == FILTER_DEFAULTS.YEAR_MIN &&
      yearTo == FILTER_DEFAULTS.YEAR_MAX
    ) {
      return;
    }
    if ($resetFiltersSignal == true) {
      yearFrom = FILTER_DEFAULTS.YEAR_MIN;
      yearTo = FILTER_DEFAULTS.YEAR_MAX;
      handleOnChange();
    }
  });
</script>

<section>
  <div class="header">
    <span class="title">{label}</span>
    <div class="values">
      <input
        min={FILTER_DEFAULTS.YEAR_MIN}
        max={FILTER_DEFAULTS.YEAR_MAX}
        type="number"
        value={yearFrom}
        on:input={(e) => typeYear("from", e, false)}
        on:change={(e) => typeYear("from", e, true)}
      />

      <input
        min={FILTER_DEFAULTS.YEAR_MIN}
        max={FILTER_DEFAULTS.YEAR_MAX}
        type="number"
        value={yearTo}
        on:input={(e) => typeYear("to", e, false)}
        on:change={(e) => typeYear("to", e, true)}
      />
    </div>
  </div>
  <div class="ranges">
    <div class="range-track-bg" bind:this={sliderTrack}></div>
    <div class="range-track" bind:this={sliderBg}></div>
    <input
      id="yearFrom"
      type="range"
      min={FILTER_DEFAULTS.YEAR_MIN}
      max={FILTER_DEFAULTS.YEAR_MAX}
      bind:value={yearFrom}
      on:input={slideOne}
    />
    <input
      id="yearTo"
      type="range"
      min={FILTER_DEFAULTS.YEAR_MIN}
      max={FILTER_DEFAULTS.YEAR_MAX}
      bind:value={yearTo}
      on:input={slideTwo}
    />
  </div>
</section>

<style lang="scss">
  @use "../../styles/filters";

  @include filters.range-filter();
</style>
