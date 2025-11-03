<script lang="ts">
    import { currentHistory } from "../../lib/stores.ts";
    export let getMovie: (id: number) => void;
    let isFlipped: boolean = false;
    // use ref for go to favorites button
    // lift state so it can be changed from other components

    function openFavorites() {
        isFlipped = true;
    }

    function openHistory() {
        isFlipped = false;
    }
</script>

<div
    class={`perspective-container ${isFlipped ? "flipped" : ""}`}
    data-selected={isFlipped}
>
    <div class="tabs">
        <button
            class="tab"
            on:click={() => (isFlipped = false)}
            data-selected={!isFlipped}>History</button
        >
        <!-- <button class="tab" on:click={() => isFlipped = true} data-selected={isFlipped}>Favorites</button> -->
    </div>
    <div class="list">
        {#each $currentHistory as log}
            <button class="note" on:click={() => getMovie(log.id)}
                >{log.name}</button
            >
        {/each}
    </div>
</div>

<style lang="scss">
    @use "../../styles/variables";
    @use "../../styles/mixins";
    @use "sass:color";
    @import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap");
    @import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap");

    .perspective-container {
        display: flex;
        // gap: 0.25rem;
        height: 100%;
    }

    .list {
        display: flex;
        // justify-content: space-between;
        flex-direction: column;
        overflow: hidden;
        border: var(--border-default);
        border-left: none;
        // width: 100%;
        flex: 1;
    }

    .tabs {
        text-orientation: mixed;
        writing-mode: vertical-rl;
        display: flex;
        // flex-direction: column;
    }
    .tab {
        background-color: transparent;
        border: none;
        font-size: 1rem;
        text-align: center;
        flex: 1;
        &[data-selected="true"] {
            border: var(--border-default);
        }
    }

    .note {
        @include mixins.ui-button();
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        justify-content: flex-start;
        font-size: 16px;
    }

    .note.to-history,
    .note.to-favorites {
        margin-block: auto 0;
        padding-inline: 1rem;
        padding-bottom: 1rem;
        font-size: 1.25rem;
        text-transform: uppercase;
    }
    .note.to-favorites {
        align-self: flex-end;
        justify-self: flex-end;
        text-align: right;

        &::before {
            content: none;
        }
    }
</style>
