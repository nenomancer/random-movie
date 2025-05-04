<script lang="ts">
    import { DEFAULT_DROPDOWN_VALUE } from "../lib/constants";
    import type { Country } from "../lib/types";

    export let label: string;
    export let options: Country[];
    export let isMultiOption: boolean = false;
    let selected: Country;
    export let onChange: (option: Country) => void;

    let open: boolean = false;

    const toggleDropdown = () => (open = !open);
    const selectOption = (option: Country) => {
        if (option === selected) {
            selected = { code: "treto?", name: DEFAULT_DROPDOWN_VALUE };
            onChange?.(selected);
        } else {
            selected = option;
            open = false;
            onChange?.(option);
        }
    };
</script>

<section class={`${isMultiOption ? "multi-option" : ""}`}>
    <div class="header">
        <span>{label}</span>
        <button class="value" on:click={toggleDropdown}
            >{selected ? selected.name : DEFAULT_DROPDOWN_VALUE}</button
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
