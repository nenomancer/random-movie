<script lang="ts">
  import { currentMovie } from "../../lib/stores";
</script>

<section class="plot" aria-label="Plot">
  <span class="title">PLT</span>
  <p class="content">
    {$currentMovie.plot ? $currentMovie.plot : "[Plot data encrypted]"}
  </p>
</section>

<style lang="scss">
  @use "../../styles/variables";
  .plot {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;

    border: variables.$border-default;
  }

  .title {
    display: block;
    text-align: center;
    border-bottom: variables.$border-default;
  }

  .content {
    display: -webkit-box;
    overflow-y: auto;
    height: 8rem;
    padding: 0.25rem 0.5rem;
    flex: 1;
    hyphens: auto;
  }
</style>
