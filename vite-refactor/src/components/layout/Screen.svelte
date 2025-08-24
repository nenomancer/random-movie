<script lang="ts">
    // export let name: string;
    // export let activeScreen: string;
    export let classes: Array<string> | undefined = undefined;
</script>

<section class={`screen ${classes && classes.join(" ")}`}>
    <slot />
</section>

<style lang="scss">
    @use "../../styles/mixins";
    .screen {
        @include mixins.edge-inset($size: 2px, $blur: 1px);
        border-radius: 0.5rem;
        padding: 1rem;
        width: 100%;
        height: 100%;
        /* display: grid; */
        display: flex;
        flex-direction: column;
        background-color: black;
        overflow-y: scroll;
    }
</style>
