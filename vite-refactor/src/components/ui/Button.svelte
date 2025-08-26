<script lang="ts">
    export let label: string | undefined;
    export let onClick: () => void;
    export let onKeydown: () => void | null = () => null;
    export let ariaLabel: string;
    export let description: string;
</script>

<button aria-label={ariaLabel} data-info={description} on:click={onClick} on:keydown={onKeydown}>
    {label}
</button>

<style>
    button {
        color: var(--color-highlight);
        background-color: var(--color-dark);
        border: none;
        transition: all var(--anim-default);
        border-right: var(--border-default);
        border-top: var(--border-default);
        flex: 1;
        white-space: nowrap;
        overflow-x: scroll;
    }

    button:last-child {
        border-right: none;
    }

    button:hover,
    button:focus-visible {
        background-color: var(--color-highlight);
        color: var(--color-dark);
        cursor: pointer;
        font-weight: 600;
    }

    button:focus-visible {
        outline: none;
    }
</style>
