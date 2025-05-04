<script lang="ts">
    import { DEFAULT_DROPDOWN_VALUE } from "../lib/constants";
    import type { Genre } from "../lib/types";

    export let label: string;
    export let options: Genre[] = [];
    export let isMultiOption: boolean = false;
    export let onChange: (option: number[]) => void;
    let genreIds: number[] = [];
    let genreNames: string[] = [DEFAULT_DROPDOWN_VALUE];

    let selected: Genre[] = [];
    let open: boolean = false;

    const toggleDropdown = () => (open = !open);
    const selectOption = (option: Genre) => {
        if (selected.includes(option)) {
            const index = selected.indexOf(option);
            selected.splice(index, 1);
        } else {
            selected = [...selected, option];
        }

        genreIds = selected.map((genre) => genre.id);
        genreNames = selected.map((genre) => genre.name);

        console.log(genreNames);
        onChange?.(genreIds);
    };
</script>

<section class={`${isMultiOption ? "multi-option" : ""}`}>
    <div class="header">
        <span>{label}</span>
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
