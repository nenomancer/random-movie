<script lang="ts">
    export let label: string;
    export let title: string;
    export let items: { id: number; name: string }[];
    export let link: string = '';
    export let onClick: (id: number) => void;
    export let getDescription: (name: string) => string;
</script>

<section
    aria-label={`${label}s`}
    data-info={`This movies ${label.toLowerCase()}s`}
>
    <h2>{title}</h2>
    {#each items as item}
        <button
            aria-label={`${label}: ${item.name}`}
            data-info={getDescription(item.name)}
            on:click={() => onClick(item.id)}
        >
            {item.name}
        </button>
    {/each}
</section>

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
