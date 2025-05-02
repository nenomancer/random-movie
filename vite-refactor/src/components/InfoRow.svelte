<script lang="ts">
    export let label: string | undefined = undefined;
    export let content: Array<string>;
    export let columnDirection: boolean = false;
</script>

<div role="row" class={`row ${columnDirection && "column-dir"}`}>
    {#if label}
        <span role="cell" class="row_header">{label}</span>
    {/if}
    <div class="row_data">
        {#each content as item}
            <span role="cell" class="row_data_cell">
                <button>{item}</button>
            </span>
        {/each}
    </div>
</div>

<style>
    .row_header,
    .row_data_cell {
        border: 2px solid black;
        padding: 4px;
    }

    .row:has(.row_header) {
        background-color: grey;
        display: grid;
        grid-template-columns: 1fr 6fr;
        grid-template-rows: 2rem;
    }

    .row_data {
        display: flex;
        overflow: hidden;
        overflow-x: scroll;
        scrollbar-width: none;
    }

    .column-dir:has(.row_header) {
        grid-template-columns: 1fr;
        grid-template-rows: unset;
    }

    .column-dir.row_data_cell {
        text-wrap: nowrap;
    }

    button {
        /* appearance: default; */
        height: 100%;
        border-radius: 0;
    }
</style>
