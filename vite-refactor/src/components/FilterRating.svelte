<script lang="ts">
    let ratingFrom: number = 0.0;
    let ratingTo: number = 10.0;
    // export let onChange: (value: number) => void;

    $: {
        if (ratingFrom > ratingTo) {
            ratingFrom = ratingTo;
        }
        if (ratingTo < ratingFrom) {
            ratingTo = ratingFrom;
        }
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
        />
        <input
            id="ratingTo"
            type="range"
            min="0"
            max="10"
            step="0.1"
            bind:value={ratingTo}
        />
    </div>
    <input type="number" value={ratingFrom} />
    <input type="number" value={ratingTo} />
</section>
