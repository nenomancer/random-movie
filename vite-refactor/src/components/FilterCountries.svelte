<script lang="ts">
    import { DEFAULT_DROPDOWN_VALUE } from "../lib/constants";
    import type { Country } from "../lib/types";
    import { openDropdown } from "../stores/ui";

    export let id: string;

    export let label: string;
    export let options: Country[];
    export let onChange: (option: Country) => void;
    export const closeDropdown = () => (open = false);

    let selected: Country;
    let open: boolean = false;
    let searchTerm: string = "";
    let inputRef: HTMLInputElement;

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
            selected = { code: "", name: DEFAULT_DROPDOWN_VALUE };
            onChange?.(selected);
        } else {
            selected = option;
            toggleDropdown(true);
            onChange?.(option);
        }
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
        option.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
</script>

<section aria-labelledby="header">
    <div id="header" aria-label="Filter movies from a certain country">
        <h3>{label}</h3>

        {#if !open}
            <button class="value" on:click={() => toggleDropdown(false)}
                >{selected ? selected.name : DEFAULT_DROPDOWN_VALUE}</button
            >
        {/if}
    </div>
    {#if open}
        <ul class="options">
            {#if open}
                <input
                    type="text"
                    bind:value={searchTerm}
                    placeholder={selected
                        ? selected.name
                        : DEFAULT_DROPDOWN_VALUE}
                    bind:this={inputRef}
                    on:keydown={(event) => {
                        if (event.key === "Escape") {
                            toggleDropdown(true);
                        }
                    }}
                />
            {/if}
            {#each filteredCountries as option}
                <button
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
        </ul>
    {/if}
</section>

<style>
    #header {
        display: grid;
        grid-template-columns: 4rem 6fr;
    }
    .options {
        display: flex;
        flex-direction: column;
        /* display: none; */
    }
</style>
