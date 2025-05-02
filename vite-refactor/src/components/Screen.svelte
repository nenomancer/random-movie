<script lang="ts">
    export let name: string;
    export let activeScreen: string;
</script>

{#if name === activeScreen}
    <section class="monitor__screen">
        <slot />
    </section>
{/if}
