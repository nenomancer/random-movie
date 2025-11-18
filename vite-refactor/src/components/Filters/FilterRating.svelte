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
    border: var(--border-default);
  }

  .title {
    @include mixins.ui-button();
    pointer-events: none;
    border-right: var(--border-default);
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
        border-right: var(--border-default);
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
      border: var(--border-default);
      border-top: 0;

      height: 100%;
      position: absolute;
    }

    .range-track {
      background-color: white;
    }
  }

  input[type="range"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    outline: none;
    position: absolute;
    margin: auto;
    top: -3.5px;

    // bottom: 0;
    background-color: transparent;
    // background-color: red;
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
    // border: 10px solid black;
  }
</style>
