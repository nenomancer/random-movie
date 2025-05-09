<script lang="ts">
    import { useFilters } from "../stores/movie";
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

<label for="useFilters">use filters:</label>
<input
    type="checkbox"
    id="useFilters"
    on:change={(event) => handleCheck(event)}
    on:keydown={(event) => handleEnter(event)}
    bind:checked={$useFilters}
/>
