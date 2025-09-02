<script lang="ts">
    import { checkFilterEnable } from "../../lib/helpers";

    let ratingFrom: number = 0.0;
    let ratingTo: number = 10.0;
    let sliderTrack: HTMLElement;
    let sliderBg: HTMLElement;
    export let onChange: (from: number, to: number) => void;

    function handleOnChange() {
        onChange(ratingFrom, ratingTo);
        const percent1 = (ratingFrom / 10) * 100;
        const percent2 = 100 - ((ratingTo / 10) * 100);

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
</script>

<section>
    <!-- rating filter  -->
    <div class="header">
        <h3>Rating</h3>

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

    section {
        position: relative;
        display: grid;
        // grid-template-rows: repeat(3, 1fr);
        // gap: 0.5rem;
        border: variables.$border-default;
    }
    .header {
        display: grid;
        grid-template-columns: 5rem 6fr;
        flex: 1;
        place-content: center;
        place-items: center;
    }

    .values {
        display: flex;
        width: 100%;
        input[type="number"] {
            flex: 1;
            text-align: center;
        }
    }

    .ranges {
        position: relative;
        display: flex;
        justify-content: center;
        // padding-inline: 50px;
        .range-track,
        .range-track-bg {
            inset-inline: 0.75rem;
            height: 1.5rem;
            background-color: blue;
            position: absolute;
        }

        .range-track {
            background-color: orange;
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
        top: -0.25rem;
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
    }

    input[type="range"] {
        &#ratingFrom::-moz-range-thumb {
            background: linear-gradient(-45deg, white 75%, transparent 75%);
            clip-path: rect(0 50% 100% 0%);
        }
        &#ratingTo::-moz-range-thumb {
            background: linear-gradient(45deg, white 75%, transparent 75%);
            clip-path: rect(0 100% 100% 50%);
        }
    }

    input[type="range"]::-ms-thumb {
        // appearance: none;
        // height: 1.7em;
        // width: 1.7em;
        // cursor: pointer;
        // border-radius: 50%;
        // background-color: #3264fe;
        // pointer-events: auto;
    }
    input[type="range"]:active::-webkit-slider-thumb {
        // background-color: #ffffff;
        // background-color: red;
        // border: 3px solid #3264fe;
    }
</style>
