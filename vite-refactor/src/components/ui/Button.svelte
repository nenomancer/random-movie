<script lang="ts">
    export let label: string | undefined;
    export let onClick: () => void;
    export let onKeydown: () => void | null = () => null;
    export let ariaLabel: string;
    export let description: string;
    export let disabled: boolean = false;
    export let classes: Array<string> = [];
    export let id: number | undefined = undefined;
</script>

<button
    aria-label={ariaLabel}
    data-info={description}
    data-id={id}
    class={`${classes.length && classes.join(" ")}`}
    {disabled}
    on:click={onClick}
    on:keydown={onKeydown}
>
    {label}
</button>

<style lang="scss">
    @use "../../styles/mixins";
    button {
        @include mixins.ui-button();
        border-right: var(--border-default);
        border-top: var(--border-default);
        flex: 1;
        white-space: nowrap;
        overflow-x: scroll;

        &.selected {
            background-color: white;
            color: black;
        }

        &.no-border {
            border: none;
        }
    }

    button:last-child {
        border-right: none;
    }
</style>
