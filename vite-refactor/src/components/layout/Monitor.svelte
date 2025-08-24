<script lang="ts">
    export let classes: Array<string> = [""];
</script>

<div class={`monitor ${classes && classes.join(" ")}`}>
    <slot />
</div>

<style lang="scss">
    @use "../../styles/variables.scss";
    @use "../../styles/_mixins.scss";
    @import url("https://fonts.googleapis.com/css2?family=Handjet:wght@100..900&display=swap");
    .monitor {
        @include mixins.edge-bevel($size: 2px, $blur: 1px);
        padding: 2.5rem;
        background-color: variables.$monitor-color;
        display: flex;
        flex-direction: column;
        grid-column: span 3;
        grid-row: span 2;
        font-family: "Handjet";
        font-weight: 500;
        line-height: normal;
        font-size: 1.5rem;
    }

    .main {
        grid-area: info;
    }

    .poster {
        grid-area: poster;
    }
</style>
