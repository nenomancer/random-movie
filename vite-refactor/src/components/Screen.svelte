<script lang="ts">
    // export let name: string;
    // export let activeScreen: string;
    export let classes: Array<string> | undefined = undefined;
</script>

<!-- {#if name === activeScreen} -->
<section class={`screen ${classes && classes.join(" ")}`}>
    <slot />
</section>

<!-- {/if} -->

<style>
    .screen {
        padding: 1rem;
        background-color: darkblue;
        width: 100%;
        height: 100%;
        /* display: grid; */
        display: flex;
        flex-direction: column;
    }
</style>
