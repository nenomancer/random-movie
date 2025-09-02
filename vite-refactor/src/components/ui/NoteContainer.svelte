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

<div class={`perspective-container ${isFlipped ? "flipped" : ""}`}>
    <div class="tape"></div>

    <div class="note-container favorites">
        <div class="favorites">
            {#each $currentHistory as log}
                <button class="note" on:click={() => getMovie(log.id)}
                    >{"- " + log.name}</button
                >
            {/each}
        </div>
        <button class="note to-history" on:click={openHistory}>
            &lt; History
        </button>
    </div>
    <div class="note-container history">
        <div class="history">
            {#each $currentHistory as log}
                <button class="note" on:click={() => getMovie(log.id)}
                    >{`- ` + log.name}</button
                >
            {/each}
        </div>
        <button class="note to-favorites" on:click={openFavorites}>
            Favorites &gt;
        </button>
    </div>
</div>

<style lang="scss">
    @use "../../styles/variables";
    @use "sass:color";
    @import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap");
    @import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap");

    $tape-size: 1.5rem;
    .perspective-container {
        perspective: 1200px;
        position: absolute;
        bottom: 3rem;
        left: 45.75%;
        scale: 0.8;
    }

    .tape {
        background-color: color.adjust(
            $color: variables.$note-color,
            $saturation: -25%,
            $lightness: -15%
        );
        width: 100%;
        height: $tape-size;
        border-top-left-radius: 0.1rem;
        border-top-right-radius: 0.1rem;
        box-shadow: 1px 1px 0.5px -0.5px rgba(0, 0, 0, 0.4);
    }

    .history {
        display: flex;
        flex-direction: column-reverse;
    }
    .note-container {
        width: 16rem;
        height: 14rem;
        transform: rotateX(10deg);
        display: flex;
        flex-direction: column;
        box-shadow:
            3px 16px 3px -4px rgba(0, 0, 0, 0.15),
            inset -0.1px -0.1px 0.5px -0.4px rgba(0, 0, 0, 0.4);
        transform-origin: top;
        background: repeating-linear-gradient(
            to bottom,
            variables.$note-color,
            variables.$note-color 10.5%,
            color.adjust($color: variables.$note-color, $lightness: -30%) 11.5%
        );
        pointer-events: none;
        -webkit-font-smoothing: antialiased; /* For WebKit browsers */
        -moz-osx-font-smoothing: grayscale; /* For Firefox on macOS */
        transition: 250ms ease-out;
        border-bottom-left-radius: 0.1rem;
        border-bottom-right-radius: 0.1rem;
        &:hover {
            transform: rotateX(7deg);
            box-shadow:
                2px 10px 2px -2px rgba(0, 0, 0, 0.2),
                inset -0.1px -0.1px 0.5px -0.4px rgba(0, 0, 0, 0.4);
        }
    }

    .note-container.history {
        position: absolute;
        top: $tape-size;
    }

    .perspective-container.flipped {
        .note-container.history {
            transform: rotateX(180deg);
            pointer-events: none;
            .note {
                pointer-events: none;
                opacity: 0.4;
            }
        }
    }

    .perspective-container:not(.flipped):has(.note-container.history:hover) {
        .note-container.favorites,
        .note-container.history {
            transform: rotateX(7deg);
        }
    }

    .note {
        padding-inline: 0.5rem;
        line-height: 1;
        pointer-events: all;
        background-color: transparent;
        border: none;
        text-align: left;
        width: 100%;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: variables.$note-marker-color;
        font-family: "Caveat", cursive;
        font-weight: 700;
        font-style: normal;
        text-shadow: -0.5px -0.5px 0 grey;
        font-size: 1.5rem;

        &:hover {
            text-decoration: underline;
            cursor: pointer;
            text-decoration-thickness: 0.1rem;
        }
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
