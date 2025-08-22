<script lang="ts"> 
    import { RELEASE_YEAR_MAX, RELEASE_YEAR_MIN } from "../../lib/constants";
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
    }

    function handleChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.value === "") {
            return;
        }

        let numeric = Number(input.value);
        if (numeric < RELEASE_YEAR_MIN) numeric = RELEASE_YEAR_MIN;
        if (numeric > RELEASE_YEAR_MAX) numeric = RELEASE_YEAR_MAX;

        input.value = numeric.toString();
        yearValue = input.value;

        onChange(Number(yearValue));
    }

    function clamp(value: number) {
        return Math.min(
            RELEASE_YEAR_MAX,
            Math.max(RELEASE_YEAR_MIN, value),
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
    }
</script>

<input
    min={RELEASE_YEAR_MIN}
    max={RELEASE_YEAR_MAX}
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
        padding-inline: 0.25rem;
        appearance: none;
        border: none;
        background-color: var(--color-dark);
        color: var(--color-highlight);
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        align-items: center;

        &:hover,
        &:focus-visible {
            background-color: var(--color-highlight);
            color: var(--color-dark);
            outline: none;
        }
    }
</style>
