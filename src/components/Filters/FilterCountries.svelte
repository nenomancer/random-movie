<script lang="ts">
  import { tick } from "svelte";
  import { DEFAULT_COUNTRY } from "../../lib/constants";
  import { checkFilterEnable } from "../../lib/helpers";
  import { clickOutside } from "../../lib/actions";
  import type { Country } from "../../lib/types";
  import {
    openDropdown,
    currentFilters,
    resetFiltersSignal,
  } from "../../lib/stores";

  export let id: string;

  // Short on-screen label ("CTR") and the full name read out by screen readers
  export let label: string;
  export let name: string = "";
  export let options: Country[];
  export let onChange: (option: Country) => void;

  let selected: Country;
  let open: boolean = false;
  let searchTerm: string = "";
  let inputRef: HTMLInputElement;
  let valueRef: HTMLButtonElement;

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

  // The X button: back to "Any" country and an empty search. Focus goes to the
  // value button, since the X disappears with the dropdown.
  const clearCountry = async () => {
    selected = DEFAULT_COUNTRY;
    searchTerm = "";
    onChange?.(selected);
    checkFilterEnable();
    toggleDropdown(true);
    await tick();
    valueRef?.focus();
  };

  $: fullName = name || label;

  // Opening another dropdown closes this one
  $: if ($openDropdown !== id) open = false;

  // The input only exists once the dropdown has rendered open
  $: if (open && inputRef) inputRef.focus();

  $: filteredCountries = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  $: if ($resetFiltersSignal) selected = DEFAULT_COUNTRY;
</script>

<section use:clickOutside={() => open && toggleDropdown(true)}>
  <div class="header">
    <span class="title">{label}</span>
    {#if !open}
      <button
        class="value"
        bind:this={valueRef}
        aria-expanded={open}
        aria-label={`${fullName}: ${selected ? selected.name : $currentFilters.country}`}
        on:click={() => toggleDropdown(false)}
      >
        {selected ? selected.name : $currentFilters.country}
      </button>
    {/if}
    {#if open}
      <div class="input-container">
        <input
          type="text"
          aria-label={`Search ${fullName.toLowerCase()}`}
          bind:value={searchTerm}
          placeholder={selected ? selected.name : DEFAULT_COUNTRY.name}
          bind:this={inputRef}
          on:keydown={(event) => {
            if (event.key === "Escape") {
              toggleDropdown(true);
            }
          }}
        />
        <button
          class="button-close"
          aria-label={`Clear ${fullName.toLowerCase()}`}
          on:click={clearCountry}
        >
          X
        </button>
      </div>
    {/if}
  </div>
  {#if open}
    <div class="options" role="group" aria-label={fullName}>
      {#each filteredCountries as option}
        <button
          class="option"
          aria-label={`Filter ${fullName.toLowerCase()}: ${option.name}`}
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
