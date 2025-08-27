<script lang="ts">
    import { FILTER_DEFAULTS } from "../../lib/constants";
    import { checkFilterEnable } from "../../lib/helpers";
    export let placeholder: string;
    export let yearValue: string | "" = "";
    let inputElement: HTMLInputElement;
    export let onChange: (yearValue: number) => void;

    function moveCursorToEnd() {
        requestAnimationFrame(() => {
            const end = inputElement.value?.length;
            inputElement.setSelectionRange(end, end);
        });
    }
    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/\D/g, "");
        yearValue = input.value;

        onChange(Number(yearValue));
        checkFilterEnable();
    }

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

    function clamp(value: number) {
        return Math.min(
            FILTER_DEFAULTS.YEAR_MAX,
            Math.max(FILTER_DEFAULTS.YEAR_MIN, value),
        ).toString();
    }

    function handleIncrement(event: KeyboardEvent) {
        let increment = 1;

        if (event.shiftKey) {
            increment = 10;
        }
        if (event.key == "ArrowUp") {
            yearValue = clamp(Number(yearValue) + increment);
        } else if (event.key == "ArrowDown") {
            yearValue = clamp(Number(yearValue) - increment);
        }

        moveCursorToEnd();
        onChange(Number(yearValue));
        checkFilterEnable();
    }
</script>

<input
    min={FILTER_DEFAULTS.YEAR_MIN}
    max={FILTER_DEFAULTS.YEAR_MAX}
    maxlength={4}
    {placeholder}
    inputmode="numeric"
    pattern="\d*"
    bind:this={inputElement}
    bind:value={yearValue}
    on:change={handleChange}
    on:input={handleInput}
    on:keydown={handleIncrement}
/>

<style>
    input {
        width: 3rem;
        padding: 0.1rem;
        appearance: none;
        border: none;
        background-color: var(--color-dark);
        color: var(--color-highlight);
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        text-align: center;
        &:hover,
        &:focus-visible {
            background-color: var(--color-highlight);
            color: var(--color-dark);
            outline: none;
        }
    }
</style>
