<script lang="ts">
    import { DEFAULT_DROPDOWN_VALUE } from "../../lib/constants";
    import { checkFilterEnable } from "../../lib/helpers";
    import type { Genre } from "../../lib/types";
    import { currentFilters, useFilters } from "../../stores/movie";
    import { openDropdown } from "../../stores/ui";
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

    // TO-DO: CLOSE DROPDOWN ON CLICK ELSEWHERE,
    // ADD BUTTONS FOR EACH GENRE, INSTEAD OF JUST ONE
    // BUTTON WITH A DYNAMIC LABEL
    const toggleDropdown = (close: boolean = false) => {
        openDropdown.update((current) => {
            if (current === id) {
                open = false;
                return null;
            } else {
                open = true;

                return id;
            }
        });
    };
    $: openDropdown.subscribe((activeId) => {
        if (activeId !== id) {
            open = false;
        }
    });

    $: currentFilters.subscribe(() => {
        if (!$currentFilters.genres?.length) {
            genreNames = [DEFAULT_DROPDOWN_VALUE];
            selected = [];
        }
    });
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
    };
</script>

<section>
    <div class="header">
        <h3 class="title">{label}</h3>
        <button
            class="value"
            on:click={() => toggleDropdown()}
            on:keydown={(event) => {
                if (event.key === "Escape") {
                    toggleDropdown(true);
                }
            }}
            >{genreNames.length
                ? genreNames.join(", ")
                : DEFAULT_DROPDOWN_VALUE}</button
        >
    </div>
    {#if open}
        <ul class="options">
            {#each options as option}
                <Button
                    ariaLabel={option.name}
                    on:keydown={(event) => {
                        if (event.key === "Escape") {
                            toggleDropdown(true);
                        }
                    }}
                    description={option.name}
                    label={option.name}
                    onClick={() => selectOption(option)}
                />
            {/each}
        </ul>
    {/if}
</section>

<style lang="scss">
    section {
        border: var(--border-default);

        button {
            // background-color: transparent;
            // border: none;
        }
    }
    .header {
        // display: flex;
        display: grid;
        grid-template-columns: 5rem 6fr;
    }
    .title {
        place-self: center;
    }

    .options {
        display: flex;
        /* flex-direction: column; */
        display: grid;
        grid-template-columns: repeat(3, 1fr);

        .option {
            text-wrap: none;
            white-space: nowrap;
            text-align: left;
        }
        /* display: none; */
    }

    .value {
        display: flex;
        flex: 1;
        white-space: nowrap;
        overflow: scroll;
    }
</style>
