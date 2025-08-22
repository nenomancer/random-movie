<script lang="ts">
    import { currentHistory } from "../stores/history";
    export let getMovie: (id: number) => void;

    // use ref for go to favorites button
    // change state on click, show different button and flip page
    // lift state so it can be changed from other components
</script>

<div class="perspective-container">
    <div class="note-container">
        {#each $currentHistory as log}
            <button class="note" on:click={() => getMovie(log.id)}
                >{" " + log.name}</button
            >
        {/each}
        <button class="note to-favorites"> Favorites > </button>
    </div>
</div>

<style lang="scss">
    @import "../styles/variables";
    @import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap");

    .perspective-container {
        perspective: 600px;
        position: absolute;
        bottom: 5%;
    }
    .note-container {
        perspective: 150px;
        width: 16rem;
        aspect-ratio: 1/0.9;
        transform: rotateX(10deg);
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
        &:hover {
            transform: rotateX(7deg);
            box-shadow:
                2px 10px 2px -2px rgba(0, 0, 0, 0.2),
                inset -0.1px -0.1px 0.5px -0.4px rgba(0, 0, 0, 0.4);
        }
    }

    .perspective-container:has(.note-container.history:hover:not(.flipped)) {
        .note-container.favorites {
            transform: rotateX(7deg);
            &:before {
                transform: rotateX(-11deg) translateY(0.5px);
            }
        }

        .note-container.history {
            transform: rotateX(7deg);
            &:before {
                transform: rotateX(-11deg) translateY(0.5px);
            }
        }
    }

    .note {
        padding-inline: 0.5rem;
        line-height: 1.5;
        // hyphens: auto;
        pointer-events: all;
        background-color: transparent;
        border: none;
        text-align: left;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: $note-marker-color;
        font-family: "Permanent Marker", cursive;
        font-weight: 400;
        font-style: normal;
        text-shadow: -0.5px -0.5px 0 grey;
        // counter-increment: history-counter;
        &::before {
            content: "•";
            // padding-right: 0.5rem;
        }
        &:hover {
            text-decoration: underline;
            cursor: pointer;
            text-decoration-thickness: 0.1rem;
        }
    }

    .note.to-favorites {
        align-self: flex-end;
        justify-self: flex-end;
        margin-block: auto 0;

        &::before {
            content: none;
        }
    }
</style>
