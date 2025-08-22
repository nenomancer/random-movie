<script lang="ts">
    export let classes: Array<string> = [""];
</script>

<div class={`monitor ${classes && classes.join(" ")}`}>
    <slot />
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Handjet:wght@100..900&display=swap");
    @import "../styles/variables.css";
    .monitor {
        border: 2rem solid beige;
        border-radius: 0.25rem;
        display: flex;
        flex-direction: column;
        grid-column: span 3;
        grid-row: span 2;
        font-family: "Handjet";
        /* font-size: 24px; */
        font-weight: 500;
        line-height: normal;
        font-size: 1.5rem;
        * {
            font: inherit;
        }
    }

    .main {
        grid-area: info;
    }

    .poster {
        grid-area: poster;
    }
</style>
