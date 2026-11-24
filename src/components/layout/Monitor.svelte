<script lang="ts">
  export let classes: Array<string> = [];
</script>

<div class={["monitor", ...classes].join(" ")}>
  <slot />
</div>

<style lang="scss">
  @use "../../styles/variables.scss";
  @use "../../styles/_mixins.scss";
  @import url("https://fonts.googleapis.com/css2?family=Quantico:ital,wght@0,400;0,700;1,400;1,700&display=swap");
  .monitor {
    @include mixins.monitor-edge();
    padding: 2rem;
    background-color: variables.$monitor-color;
    display: flex;
    flex-direction: column;
    font-family: "Quantico";
    letter-spacing: -1.2px;
    font-weight: 350;
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
