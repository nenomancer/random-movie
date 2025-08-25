<script lang="ts">
    let ratingFrom: number = 0.0;
    let ratingTo: number = 10.0;
    export let onChange: (from: number, to: number) => void;

    function handleOnChange() {
        onChange(ratingFrom, ratingTo);
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
    <h3>Rating</h3>
    <div>
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
    <input type="number" value={ratingFrom} />
    <input type="number" value={ratingTo} />
</section>
