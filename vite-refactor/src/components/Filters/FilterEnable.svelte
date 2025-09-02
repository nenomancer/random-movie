<script lang="ts">
    import { useFilters } from "../../lib/stores.ts";
    function handleCheck(event: Event) {
        const target = event.target as HTMLInputElement;
        useFilters.set(target.checked);
    }

    function handleEnter(event: KeyboardEvent) {
        if (event.key === "Enter") {
            const target = event.target as HTMLInputElement;
            target.checked = !target.checked;
            handleCheck(event);
        }
    }
</script>

<div class="control-button">
    <label for="useFilters">Use</label>
    <input
        type="checkbox"
        id="useFilters"
        on:change={(event) => handleCheck(event)}
        on:keydown={(event) => handleEnter(event)}
        bind:checked={$useFilters}
    />
</div>

<style lang="scss">
    @use "../../styles/mixins";
    .control-button {
        @include mixins.control-button();
        border: none;
        transition: 250ms ease-out;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        input {
            position: absolute;
            inset: 0;
            appearance: none;
            // left: 0;
        }

        label {
            // text-align: center;
        }
    }
</style>
