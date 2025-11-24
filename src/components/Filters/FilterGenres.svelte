<script lang="ts">
  import { DEFAULT_DROPDOWN_VALUE } from "../../lib/constants";
  import { checkFilterEnable } from "../../lib/helpers";
  import type { Genre } from "../../lib/types";
  import {
    openDropdown,
    currentFilters,
    useFilters,
    resetFiltersSignal,
  } from "../../lib/stores.ts";
  import Button from "../ui/Button.svelte";

  export let label: string;
  export let options: Genre[] = [];
  export let onChange: (option: string[]) => void;
  export const closeDropdown = () => (open = false);
  export let id: string;
  let genreIds: string[] = [];
  let genreNames: string[] = [DEFAULT_DROPDOWN_VALUE];

  let selected: Genre[] = [];
  let open: boolean = false;

  let genreListElement: HTMLUListElement;

  // ADD BUTTONS FOR EACH GENRE, INSTEAD OF JUST ONE
  // BUTTON WITH A DYNAMIC LABEL

  const checkSelectedGenres = () => {
    const genres = genreListElement?.querySelectorAll(".option");
    genres?.forEach((child) => {
      const genre = child.getAttribute("data-id")!;
      if ($currentFilters?.genres?.includes(genre)) {
        child.classList.add("selected");
      } else if (!$currentFilters?.genres?.includes(genre)) {
        child.classList.remove("selected");
      }
    });
  };

  const selectOption = (option: Genre) => {
    if (selected.includes(option)) {
      const index = selected.indexOf(option);
      selected.splice(index, 1);
    } else {
      selected = [...selected, option];
    }

    genreIds = selected.map((genre) => genre.id.toString());
    genreNames = selected.map((genre) => genre.name);
    onChange?.(genreIds);
    checkFilterEnable();
    checkSelectedGenres();
  };

  const toggleDropdown = () => {
    checkSelectedGenres();

    openDropdown.update((current) => {
      if (current === id) {
        open = false;
        return null;
      } else {
        open = true;

        return id;
      }
    });
    console.log("open? ", open);
    if (open) {
      console.log("hee...");
    }
  };
  $: openDropdown.subscribe((activeId) => {
    if (activeId !== id) {
      open = false;
    }
  });

  $: resetFiltersSignal.subscribe(() => {
    if ($resetFiltersSignal == true) {
      genreNames = [DEFAULT_DROPDOWN_VALUE];
      selected = [];
    }
  });

  // $: currentFilters.subscribe(() => {
  //     if ($currentFilters.genres?.includes(id)) {
  //         console.log("eyo its here! ", label);
  //     }
  // });
</script>

<section data-open={open}>
  <div class="header" >
    <h3 class="title">{label}</h3>
    <button
      class="value"
      on:click={() => toggleDropdown()}
      on:keydown={(event) => {
        if (event.key === "Escape") {
          toggleDropdown();
        }
      }}
      >{genreNames.length
        ? genreNames.join(", ")
        : DEFAULT_DROPDOWN_VALUE}</button
    >
  </div>
  <ul class="options" bind:this={genreListElement} >
    {#each options as option}
      <Button
        classes={["option", "no-border"]}
        ariaLabel={option.name}
        id={option.id}
        on:keydown={(event) => {
          if (event.key === "Escape") {
            toggleDropdown();
          }
        }}
        description={option.name}
        label={option.name}
        onClick={() => selectOption(option)}
      />
    {/each}
  </ul>
  <!-- {#if open}{/if} -->
</section>

<style lang="scss">
  @use "../../styles/mixins";
  @use "../../styles/variables";
  section {
    border: variables.$border-default;

    &[data-open="false"] {
      .header {
        border: none;
      }
      .options {
        display: none;
      }
    }
  }
  .header {
    // display: flex;
    display: grid;
    grid-template-columns: 1fr 6fr;
    border-bottom: variables.$border-default;
  }
  .title {
    @include mixins.ui-button();
    pointer-events: none;
    border-right: variables.$border-default;
    font-weight: bold;
  }

  .options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    &[data-open="false"] {
      display: none;
      .header {
        border: none;
      }
    }

    button {
      background-color: red;
    }
  }

  .value {
    @include mixins.ui-button();
    justify-content: flex-start;
    flex: 1;
    white-space: nowrap;
    overflow: scroll;
  }
</style>
