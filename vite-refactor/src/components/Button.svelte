<script lang="ts">
    export let label: string | undefined;
    export let onClick: () => void;
    export let ariaLabel: string;
    export let description: string;
</script>

<button aria-label={ariaLabel} data-info={description} on:click={onClick}>
    {label}
</button>

<style>
    button {
        color: var(--color-highlight);
        background-color: var(--color-dark);
        border: none;
        transition: all var(--anim-default);
        border: var(--border-default);
        border-left: none;
        flex: 1;
        white-space: nowrap;
        height: 1.8rem;
        overflow-x: scroll;
    }

    button:first-child {
        border-left: var(--border-default);
    }

    button:hover,
    button:focus-visible {
        background-color: var(--color-highlight);
        color: var(--color-dark);
        cursor: pointer;
    }

    button:focus-visible {
        outline: none;
    }
</style>
