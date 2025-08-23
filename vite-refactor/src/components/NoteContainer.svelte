<script lang="ts">
    import { currentHistory } from "../stores/history";
    export let getMovie: (id: number) => void;
    let isFlipped: boolean = false;
    // use ref for go to favorites button
    // change state on click, show different button and flip page
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
                    >{" " + log.name}</button
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
                    >{" " + log.name}</button
                >
            {/each}
        </div>
        <button class="note to-favorites" on:click={openFavorites}>
            Favorites &gt;
        </button>
    </div>
</div>

<style lang="scss">
    @import "../styles/variables";
    @import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap");

    .perspective-container {
        perspective: 1200px;
        position: absolute;
        bottom: 0.5%;
        left: 40%;
        scale: 0.8;
    }

    .tape {
        background-color: darkgoldenrod;
        width: 100%;
        height: 10px;
        // perspective: 150px;
        width: 16rem;
        aspect-ratio: 0.9/1;
        transform: rotateY(-14deg) rotateX(-15deg) translateX(-4px)
            translateY(1px) scale(1.03);
        scale: 0.8;
    }

    .history {
        display: flex;
        flex-direction: column-reverse;
    }
    .note-container {
        // perspective: 150px;
        width: 16rem;
        aspect-ratio: 0.9/1;
        transform: rotateX(10deg);
        scale: 0.8;
        display: flex;
        flex-direction: column;
        box-shadow:
            3px 16px 3px -4px rgba(0, 0, 0, 0.15),
            inset -0.1px -0.1px 0.5px -0.4px rgba(0, 0, 0, 0.4);
        transform-origin: top;
        rotate: -2deg;
        background: repeating-linear-gradient(
            to bottom,
            $note-color,
            $note-color 10.5%,
            darken($note-color, 30%) 11.5%
        );
        // background: $note-color;
        pointer-events: none;
        // counter-reset: history-counter;
        // will-change: transform;
        -webkit-font-smoothing: antialiased; /* For WebKit browsers */
        -moz-osx-font-smoothing: grayscale; /* For Firefox on macOS */
        transition: 250ms ease-out;
        // scale: -80%;
        // transform: rotateX(180deg);
        &:hover {
            transform: rotateX(7deg);
            box-shadow:
                2px 10px 2px -2px rgba(0, 0, 0, 0.2),
                inset -0.1px -0.1px 0.5px -0.4px rgba(0, 0, 0, 0.4);
        }
    }

    .note-container.history {
        position: absolute;
        top: 10px;
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
        .note-container.favorites {
            transform: rotateX(7deg);
            // &:before {
            //     transform: rotateX(-11deg) translateY(0.5px);
            // }
        }

        .note-container.history {
            transform: rotateX(7deg);
            // &:before {
            //     transform: rotateX(-11deg) translateY(0.5px);
            // }
        }
    }

    .note {
        padding-inline: 0.5rem;
        line-height: 1.9;
        // hyphens: auto;
        pointer-events: all;
        background-color: transparent;
        border: none;
        text-align: left;
        width: 100%;
        // flex: 1;
        // font-size: 0.9rem;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: $note-marker-color;
        font-family: "Permanent Marker", cursive, "Arial";
        font-weight: 700;
        font-style: normal;
        text-shadow: -0.5px -0.5px 0 grey;
        // counter-increment: history-counter;
        &::before {
            // content: "•";
            // padding-right: 0.5rem;
        }
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
        // width: auto;
        font-size: 1.25rem;
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
