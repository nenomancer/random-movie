<script lang="ts">
    import { useFilters } from "../../stores/movie";
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
    <label for="useFilters">Enable</label>
    <input
        type="checkbox"
        id="useFilters"
        on:change={(event) => handleCheck(event)}
        on:keydown={(event) => handleEnter(event)}
        bind:checked={$useFilters}
    />
</div>

<style lang="scss">
    @import "../../styles/mixins";
    .control-button {
        background: red;
        border: none;
        transition: 250ms ease-out;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        @include control-button();
        // box-shadow:
        //     inset 0 0 3px 4px hsl(0, 100%, 0%),
        //     0 4px 3px 0 hsla(0, 0%, 0%, 0.6),
        //     0 0 1px 1px rgba(255, 255, 255, 0.4),
        //     -1px -1px 1px 0 hsla(0, 0%, 0%, 0.425);

        // &:has(input:checked),
        // &:active {
        //     box-shadow:
        //         inset 0 0 3px 4px hsl(0, 100%, 0%),
        //         0 1px 1px 0 hsla(0, 0%, 0%, 0.6),
        //         0 0 1px 1px rgba(255, 255, 255, 0.4),
        //         -1px -1px 1px 0 hsla(0, 0%, 0%, 0.425);
        // }

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
