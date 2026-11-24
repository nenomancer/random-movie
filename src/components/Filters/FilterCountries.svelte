<script lang="ts">
  import { DEFAULT_COUNTRY } from "../../lib/constants";
  import { checkFilterEnable } from "../../lib/helpers";
  import type { Country } from "../../lib/types";
  import {
    openDropdown,
    currentFilters,
    resetFiltersSignal,
  } from "../../lib/stores";

  export let id: string;

  export let label: string;
  export let options: Country[];
  export let onChange: (option: Country) => void;
  export const closeDropdown = () => (open = false);

  let selected: Country;
  let open: boolean = false;
  let searchTerm: string = "";
  let inputRef: HTMLInputElement;

  // TO-DO: CLOSE DROPDOWN ON CLICK ANYWHERE ELSE
  const toggleDropdown = (close: boolean = false) => {
    openDropdown.update((current) => {
      if (close) {
        open = false;
        return null;
      }
      if (current === id) {
        open = false;
        return null;
      } else {
        open = true;

        return id;
      }
    });
  };

  const selectOption = (option: Country) => {
    if (option === selected) {
      selected = DEFAULT_COUNTRY;
      onChange?.(selected);
    } else {
      selected = option;
      toggleDropdown(true);
      onChange?.(option);
    }
    checkFilterEnable();
  };

  $: openDropdown.subscribe((activeId) => {
    if (activeId !== id) {
      open = false;
    }
    if (open) {
      inputRef?.focus();
    }
  });

  $: filteredCountries = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  $: resetFiltersSignal.subscribe(() => {
    if ($resetFiltersSignal == true) {
      selected = DEFAULT_COUNTRY;
    }
  });
</script>

<section>
  <div class="header">
    <span class="title">{label}</span>
    {#if !open}
      <button class="value" on:click={() => toggleDropdown(false)}
        >{selected ? selected.name : $currentFilters.country}</button
      >
    {/if}
    {#if open}
      <div class="input-container">
        <input
          type="text"
          bind:value={searchTerm}
          placeholder={selected ? selected.name : DEFAULT_COUNTRY.name}
          bind:this={inputRef}
          on:keydown={(event) => {
            if (event.key === "Escape") {
              toggleDropdown(true);
            }
          }}
        />
        <button on:click={() => toggleDropdown(false)} class="button-close"
          >X</button
        >
      </div>
    {/if}
  </div>
  {#if open}
    <div class="options" role="group" aria-label={label}>
      {#each filteredCountries as option}
        <button
          class="option"
          aria-label={`Filter ${label.toLowerCase()}: ${option.name}`}
          data-info={`Pick to find movies from  ${option.name}`}
          on:click={() => selectOption(option)}
          on:keydown={(event) => {
            if (event.key === "Escape") {
              toggleDropdown(true);
            }
          }}
        >
          {option.name}
        </button>
      {/each}
    </div>
  {/if}
</section>

<style lang="scss">
  @use "../../styles/filters";

  @include filters.search-dropdown();
</style>
