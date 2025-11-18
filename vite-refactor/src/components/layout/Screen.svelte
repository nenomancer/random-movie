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
        @include mixins.edge-inset($size: 2px, $blur: 1px, $shadow-size: 1rem);
        border-radius: 0.5rem;
        padding: 1rem;
        width: 100%;
        height: 100%;
        /* display: grid; */
        display: flex;
        flex-direction: column;
        background-color: #131313;
        overflow-y: scroll;
        .cell {
            @include mixins.ui-button();
    
            padding-inline: 0.5rem;
            padding-block: 0.4rem;
            white-space: nowrap;
        }
    }

</style>
