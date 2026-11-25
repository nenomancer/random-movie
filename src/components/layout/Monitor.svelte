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
    // Quantico has no Cyrillic or Greek; those characters fall back to Exo 2
    font-family: "Quantico", "Exo 2", sans-serif;
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
