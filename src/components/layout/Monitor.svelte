<script lang="ts">
  export let classes: Array<string> = [];
</script>

<div class={["monitor", ...classes].join(" ")}>
  <slot />
</div>

<style lang="scss">
  @use "../../styles/variables.scss";
  @use "../../styles/_mixins.scss";
  .monitor {
    @include mixins.monitor-edge();
    padding: 2rem;
    background-color: variables.$monitor-color;
    display: flex;
    flex-direction: column;
    font-family: "Quantico";
    letter-spacing: -0.5px;
    font-weight: 400;
  }

  .main {
    grid-area: info;
  }

  .poster {
    grid-area: poster;
  }

  .history {
    grid-area: history;
  }
</style>
