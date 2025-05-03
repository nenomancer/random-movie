<script lang="ts">
    export let label: string;
    export let onClick: () => void;
    export let ariaLabel: string;
    export let description: string;
</script>

<button aria-label={ariaLabel} data-info={description} on:click={onClick}>
    {label}
</button>
