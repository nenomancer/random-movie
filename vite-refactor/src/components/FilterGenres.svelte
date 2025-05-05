<script lang="ts">
    import { DEFAULT_DROPDOWN_VALUE } from "../lib/constants";
    import type { Genre } from "../lib/types";
    import { openDropdown } from "../stores/ui";

    export let label: string;
    export let options: Genre[] = [];
    export let onChange: (option: number[]) => void;
    export const closeDropdown = () => (open = false);
    export let id: string;
    let genreIds: number[] = [];
    let genreNames: string[] = [DEFAULT_DROPDOWN_VALUE];

    let selected: Genre[] = [];
    let open: boolean = false;

    const toggleDropdown = () => {
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
    const selectOption = (option: Genre) => {
        if (selected.includes(option)) {
            const index = selected.indexOf(option);
            selected.splice(index, 1);
        } else {
            selected = [...selected, option];
        }

        genreIds = selected.map((genre) => genre.id);
        genreNames = selected.map((genre) => genre.name);

        onChange?.(genreIds);
    };
</script>

<section>
    <div class="header">
        <h3>{label}</h3>
        <button class="value" on:click={toggleDropdown}
            >{genreNames.length
                ? genreNames.join(", ")
                : DEFAULT_DROPDOWN_VALUE}</button
        >
    </div>
    {#if open}
        <ul class="options">
            {#each options as option}
                <button on:click={() => selectOption(option)}>
                    {option.name}
                </button>
            {/each}
        </ul>
    {/if}
</section>

<style>
    .options {
        display: flex;
        flex-direction: column;
        /* display: none; */
    }
</style>
