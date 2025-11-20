<script lang="ts">
  // export let name: string;
  // export let activeScreen: string;
  export let classes: Array<string> | undefined = undefined;
</script>

<section class={`screen ${classes && classes.join(" ")}`}>
  <div class="scrollable">
    <slot />
  </div>
</section>

<style lang="scss">
  @use "../../styles/mixins";
  @use "../../styles/variables";
  .screen {
    @include mixins.screen-inset();
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: variables.$screen-color;

    .scrollable {
      padding: 1rem;
      width: 100%;
      overflow-y: scroll;
      height: 100%;
    }
  }
</style>
