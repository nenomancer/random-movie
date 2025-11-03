<script lang="ts">
    import { DEFAULT_COUNTRY } from "../../lib/constants";
    import { checkFilterEnable } from "../../lib/helpers";
    import type { Country } from "../../lib/types";
    import {
        openDropdown,
        currentFilters,
        useFilters,
        resetFiltersSignal,
    } from "../../lib/stores.ts";

    export let id: string;

    export let label: string;
    export let options: Country[];
    export let onChange: (option: Country) => void;
    export const closeDropdown = () => (open = false);
    let country;

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
        option.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    $: resetFiltersSignal.subscribe(() => {
        if ($resetFiltersSignal == true) {
            selected = DEFAULT_COUNTRY;
        }
    });
</script>

<section>
    <div class="header" aria-label="Filter movies from a certain country">
        <h3 class="title">{label}</h3>
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
                    placeholder={selected
                        ? selected.name
                        : DEFAULT_COUNTRY.name}
                    bind:this={inputRef}
                    on:keydown={(event) => {
                        if (event.key === "Escape") {
                            toggleDropdown(true);
                        }
                    }}
                />
                <button
                    on:click={() => toggleDropdown(false)}
                    class="button-close">X</button
                >
            </div>
        {/if}
    </div>
    {#if open}
        <ul class="options">
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
        </ul>
    {/if}
</section>

<style lang="scss">
    @use "../../styles/mixins";
    section {
        // border: var(--border-default);
    }
    .header {
        display: grid;
        grid-template-columns: 1fr 6fr;
        border: var(--border-default);

    }

    .value {
        @include mixins.ui-button();
        // text-align: left;
        justify-content: flex-start;
    }

    .input-container {
        position: relative;
        // width: 100%;
        input {
            width: 100%;
            @include mixins.ui-button();
            // text-align: center;
        }

        .button-close {
            position: absolute;
            right: 0;
            top: 0;
            border: none;
            height: 100%;
            width: 20%;
            background-color: transparent;
            cursor: pointer;

            &:hover {
                color: black;
                background-color: var(--color-highlight);
            }
        }
    }

    .title {
        @include mixins.ui-button();
        pointer-events: none;
        
        border-right: var(--border-default);
        // text-align: center;
        font-weight: bold;
    }

    .options {
        display: flex;
        flex-direction: column;
        /* display: none; */
        max-height: 200px;
        overflow: scroll;
        border: var(--border-default);
        border-top: none
    }

    .option {
        @include mixins.ui-button();
        border-bottom: var(--border-default);
        &:last-child {
            border-bottom: none;
        }
    }
</style>
