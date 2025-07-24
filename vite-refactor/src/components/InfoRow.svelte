<script lang="ts">
    export let label: string;
    export let title: string;
    export let items: { id: number; name: string }[];
    export let link: string = "";
    export let onClick: (id: number) => void;
    export let getDescription: (name: string) => string;
</script>

<section
    class="row"
    aria-label={`${label}s`}
    data-info={`This movies ${label.toLowerCase()}s`}
>
    <h2 class="row_header">{title}</h2>
    <div class="row_data" tabindex="-1">
        {#if items}
            {#each items as item}
                <button
                    class="row_data_cell"
                    aria-label={`${label}: ${item.name}`}
                    data-info={getDescription(item.name)}
                    on:click={() => onClick(item.id)}
                >
                    {item.name}
                </button>
            {/each}
        {/if}
        {#if !items.length}
            <span class="row_data_cell">[{label} recognition failed]</span>
        {/if}
    </div>
</section>

<style>
    section {
        border: var(--border-default);
        font-size: 1.2rem;
    }
    .row_header,
    .row_data_cell {
        /* border: var(--border-default); */
        padding-inline: 0.5rem;
        white-space: nowrap;
    }

    .row_data_cell {
        border-left: none;
    }

    .row_header {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .row:has(.row_header) {
        display: grid;
        grid-template-columns: 1fr 6fr;
        /* grid-template-rows: var(--height-row); */
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
        height: 100%;
        border-radius: 0;
        border: none;
        transition: all var(--anim-default);
        background-color: var(--color-dark);
        &:hover,
        &:focus-visible {
            cursor: pointer;
            background-color: var(--color-highlight);
            color: var(--color-dark);
            outline: none;
        }
    }
</style>
