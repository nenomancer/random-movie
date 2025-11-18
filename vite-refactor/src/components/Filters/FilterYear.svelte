<script lang="ts">
    import { FILTER_DEFAULTS } from "../../lib/constants";
    import { checkFilterEnable } from "../../lib/helpers";
    import { currentFilters, resetFiltersSignal } from "../../lib/stores";
    export let placeholder: string;
    export let yearValue: string | "" = placeholder;
    let inputElement: HTMLInputElement;
    export let onChange: (yearValue: number) => void;

    function handleChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.value === "") {
            return;
        }

        let numeric = Number(input.value);
        if (numeric < FILTER_DEFAULTS.YEAR_MIN)
            numeric = FILTER_DEFAULTS.YEAR_MIN;
        if (numeric > FILTER_DEFAULTS.YEAR_MAX)
            numeric = FILTER_DEFAULTS.YEAR_MAX;

        input.value = numeric.toString();
        yearValue = input.value;

        onChange(Number(yearValue));
        checkFilterEnable();
    }

   
    $: resetFiltersSignal.subscribe(() => {
        if ($resetFiltersSignal == true) {
            yearValue = placeholder;
        }
    });
</script>

<input
    min={FILTER_DEFAULTS.YEAR_MIN}
    max={FILTER_DEFAULTS.YEAR_MAX}
    type="number"
    maxlength={4}
    {placeholder}
    inputmode="numeric"
    pattern="\d*"
    bind:this={inputElement}
    bind:value={yearValue}
    on:change={handleChange}
/>

<style lang="scss">
    @use "../../styles/mixins";
    input {
        @include mixins.ui-button();
        width: 100%;
        text-align: center;
        &:nth-child(1) {
            border-right: var(--border-default);
        }
        &:hover,
        &:focus-visible {
            background-color: var(--color-highlight);
            color: var(--color-dark);
            outline: none;
        }
    }
</style>
