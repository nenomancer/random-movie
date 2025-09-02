<script lang="ts">
    export let classes: Array<string> = [""];
    export let padding: number | undefined = undefined;
    export let radius: number | undefined = undefined;

    const default_values = {
        padding: "2.5rem",
        radius: "2px",
    };
</script>

<div
    class={`monitor ${classes && classes.join(" ")}`}
    style={`
    ${padding ? `padding: ${padding}rem;` : `padding: ${default_values.padding}rem;`}
    ${radius ? `border-radius: ${radius}px;` : `border-radius: ${default_values.radius}px;`}
    `}
>
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
    .extras-info {
        grid-area: info;
    }
    .monitor.extras-filter {
        grid-area: filters;
        grid-column: span 2;
    }
</style>
