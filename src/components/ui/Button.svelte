<script lang="ts">
  export let label: string | undefined;
  export let onClick: () => void;
  export let ariaLabel: string;
  export let description: string;
  export let disabled: boolean = false;
  // Set for toggle buttons so assistive tech announces the on/off state
  export let pressed: boolean | undefined = undefined;
  export let classes: Array<string> = [];
  export let id: number | undefined = undefined;
</script>

<button
  aria-label={ariaLabel}
  data-info={description}
  data-id={id}
  class={classes.join(" ")}
  aria-pressed={pressed}
  {disabled}
  on:click={onClick}
  on:keydown
>
  {label}
  <slot />
  
</button>

<style lang="scss">
  @use "../../styles/mixins";
  @use "../../styles/variables";
  button {
    @include mixins.ui-button();
    border-right: variables.$border-default;
    border-top: variables.$border-default;
    flex: 1;
    white-space: nowrap;
    overflow-x: auto;
  }

  button:last-child {
    border-right: none;
  }
</style>
