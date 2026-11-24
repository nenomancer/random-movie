<script lang="ts">
  import { FILTER_DEFAULTS } from "../../lib/constants";
  import { checkFilterEnable } from "../../lib/helpers";
  import { currentFilters, resetFiltersSignal } from "../../lib/stores";

  let ratingFrom: number = 0.0;
  let ratingTo: number = 10.0;
  let sliderTrack: HTMLElement;
  let sliderBg: HTMLElement;
  export let onChange: (from: number, to: number) => void;
  export let label: string = "";

  function handleOnChange() {
    ratingFrom = isNaN(ratingFrom)
      ? FILTER_DEFAULTS.RATING_MIN
      : Math.min(
          Math.max(ratingFrom, FILTER_DEFAULTS.RATING_MIN),
          FILTER_DEFAULTS.RATING_MAX,
        );

    ratingTo = isNaN(ratingTo)
      ? FILTER_DEFAULTS.RATING_MAX
      : Math.min(
          Math.max(ratingTo, FILTER_DEFAULTS.RATING_MIN),
          FILTER_DEFAULTS.RATING_MAX,
        );

    onChange(ratingFrom, ratingTo);
    const percent1 = (ratingFrom / 10) * 100;
    const percent2 = 100 - (ratingTo / 10) * 100;

    // TODO: make sure colors use variables
    sliderBg.style.left = `${percent1}%`;
    sliderBg.style.right = `${percent2}%`;
    checkFilterEnable();
  }

  const minGap = 0;

  function slideOne(e: any) {
    const value = parseFloat(e.target.value);
    if (value > ratingTo - minGap) {
      ratingFrom = ratingTo - minGap;
    } else {
      ratingFrom = value;
    }

    handleOnChange();
  }

  function slideTwo(e: any) {
    const value = parseFloat(e.target.value);
    if (value < ratingFrom + minGap) {
      ratingTo = ratingFrom + minGap;
    } else {
      ratingTo = value;
    }
    handleOnChange();
  }

  $: resetFiltersSignal.subscribe(() => {
    if (
      ratingFrom == FILTER_DEFAULTS.RATING_MIN &&
      ratingTo == FILTER_DEFAULTS.RATING_MAX
    ) {
      return;
    }
    if ($resetFiltersSignal == true) {
      ratingFrom = FILTER_DEFAULTS.RATING_MIN;
      ratingTo = FILTER_DEFAULTS.RATING_MAX;
      handleOnChange();
    }
  });
</script>

<section>
  <!-- rating filter  -->
  <div class="header">
    <h3 class="title">{label}</h3>

    <div class="values">
      <input
        type="number"
        min={0}
        max={10.0}
        bind:value={ratingFrom}
        on:input={slideOne}
        step="0.1"
      />
      <input
        type="number"
        min={0}
        max={10.0}
        bind:value={ratingTo}
        on:input={slideTwo}
        step="0.1"
      />
    </div>
  </div>
  <div class="ranges">
    <div class="range-track-bg" bind:this={sliderTrack}></div>
    <div class="range-track" bind:this={sliderBg}></div>
    <input
      id="ratingFrom"
      type="range"
      min="0"
      max="10"
      step="0.1"
      bind:value={ratingFrom}
      on:input={slideOne}
    />
    <input
      id="ratingTo"
      type="range"
      min="0"
      max="10"
      step="0.1"
      bind:value={ratingTo}
      on:input={slideTwo}
    />
  </div>
</section>

<style lang="scss">
  @use "../../styles/filters";

  @include filters.range-filter();
</style>
