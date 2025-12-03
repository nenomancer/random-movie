<script lang="ts">
  import { FILTER_DEFAULTS } from "../../lib/constants";
  import { checkFilterEnable } from "../../lib/helpers";
  import { currentFilters, resetFiltersSignal } from "../../lib/stores.ts";
  export let label: string = "";
  let yearFrom: number = FILTER_DEFAULTS.YEAR_MIN;
  let yearTo: number = FILTER_DEFAULTS.YEAR_MAX;
  let sliderTrack: HTMLElement;
  let sliderBg: HTMLElement;
  let minGap = 0;
  function onChange(from, to) {
    currentFilters.update((filters) => ({
      ...filters,
      yearFrom: from,
      yearTo: to,
    }));
  }

  function handleOnChange() {
    yearFrom = Math.min(Math.max(yearFrom, FILTER_DEFAULTS.YEAR_MIN), FILTER_DEFAULTS.YEAR_MAX);
    yearTo = Math.min(Math.max(yearTo, FILTER_DEFAULTS.YEAR_MIN), FILTER_DEFAULTS.YEAR_MAX);
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

  function slideOne(e: any) {
    const value = parseFloat(e.target.value);
    if (value > yearTo - minGap) {
      yearFrom = yearTo - minGap;
    } else {
      yearFrom = value;
    }

    handleOnChange();
  }

  function slideTwo(e: any) {
    const value = parseFloat(e.target.value);
    if (value < yearFrom + minGap) {
      yearTo = yearFrom + minGap;
    } else {
      yearTo = value;
    }
    handleOnChange();
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
    <h3 class="title">{label}</h3>
    <div class="values">
      <input
        min={FILTER_DEFAULTS.YEAR_MIN}
        max={FILTER_DEFAULTS.YEAR_MAX}
        type="number"
        maxlength={4}
        bind:value={yearFrom}
        on:input={slideOne}
      />

      <input
        min={FILTER_DEFAULTS.YEAR_MIN}
        max={FILTER_DEFAULTS.YEAR_MAX}
        type="number"
        maxlength={4}
        bind:value={yearTo}
        on:input={slideTwo}
      />
    </div>
  </div>
  <div class="ranges">
    <div class="range-track-bg" bind:this={sliderTrack}></div>
    <div class="range-track" bind:this={sliderBg}></div>
    <input
      id="ratingFrom"
      type="range"
      min={FILTER_DEFAULTS.YEAR_MIN}
      max={FILTER_DEFAULTS.YEAR_MAX}
      bind:value={yearFrom}
      on:input={slideOne}
    />
    <input
      id="ratingTo"
      type="range"
      min={FILTER_DEFAULTS.YEAR_MIN}
      max={FILTER_DEFAULTS.YEAR_MAX}
      bind:value={yearTo}
      on:input={slideTwo}
    />
  </div>
</section>

<style lang="scss">
  @use "../../styles/variables";
  @use "../../styles/mixins";

  section {
    position: relative;
    display: grid;
  }
  .header {
    display: grid;
    grid-template-columns: 1fr 6fr;
    flex: 1;
    place-content: center;
    place-items: center;
    border: variables.$border-default;
  }

  .title {
    @include mixins.ui-button();
    pointer-events: none;
    border-right: variables.$border-default;
    font-weight: bold;
    width: 100%;
  }

  .values {
    display: flex;
    width: 100%;
    input[type="number"] {
      @include mixins.ui-button();
      flex: 1;
      text-align: center;
      -webkit-appearance: textfield;
      -moz-appearance: textfield;
      appearance: textfield;
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }

      &:first-child {
        border-right: variables.$border-default;
      }
    }
  }

  .ranges {
    position: relative;
    display: subgrid;
    height: 1.5rem;

    .range-track,
    .range-track-bg {
      inset-inline: 0;
      border: variables.$border-default;
      border-top: 0;
      height: 100%;
      position: absolute;
    }

    .range-track {
      background-color: variables.$ui-color-foreground;
    }
  }

  input[type="range"] {
    position: absolute;
    top: -3.5px;
    margin: auto;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    outline: none;
    background-color: transparent;
    pointer-events: none;
  }

  input[type="range"]::-webkit-slider-runnable-track,
  input[type="range"]::-moz-range-track,
  input[type="range"]::-ms-track {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  input[type="range"]::-moz-range-thumb,
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: none;
    appearance: none;
    cursor: pointer;
    pointer-events: auto;
    border-radius: 0;
    background-color: transparent;
  }
</style>
