<script lang="ts">
    export let label: string;
    export let title: string;
    export let items: { id: number; name: string }[];
    export const link: string = "";
    export let onClick: (id: number) => void;
    export let getDescription: (name: string) => string;
</script>

<section
    class="row"
    aria-label={`${label}s`}
    data-info={`This movies ${label.toLowerCase()}s`}
>
    <h2 class="title">{title}</h2>
    <div class="content" tabindex="-1">
        {#if items}
            {#each items as item}
                <button
                    class="cell"
                    aria-label={`${label}: ${item.name}`}
                    data-info={getDescription(item.name)}
                    on:click={() => onClick(item.id)}
                >
                    {item.name}
                </button>
            {/each}
        {/if}
        {#if !items.length}
            <span class="cell">[{label} recognition failed]</span>
        {/if}
    </div>
</section>

<style lang="scss">
    @use '../../styles/mixins';
    @use '../../styles/variables';
    section {
        /* border: variables.$border-default; */
        // font-size: 1.25rem;
    }
    .title,
    .cell {
        /* border: variables.$border-default; */
        padding-inline: 0.5rem;
        padding-block: 0.4rem;
        white-space: nowrap;
    }

    .title {
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: variables.$border-default;
    }
    .row:has(.title) {
        display: grid;
        grid-template-columns: 4rem 6fr;
        border: variables.$border-default;
        &:not(:last-child) {
            border-bottom: none;
        }

        /* grid-template-rows: var(--height-row); */
    }

    .content {
        display: flex;
        overflow: hidden;
        overflow-x: scroll;
        scrollbar-width: none;
    }

    .cell {
        @include mixins.ui-button();
        height: 100%;
        border-radius: 0;
        border: none;
    }
</style>
