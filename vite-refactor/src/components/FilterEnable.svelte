<script lang="ts">
    import { useFilters } from "../stores/movie";
    function handleCheck(event: Event) {
        const target = event.target as HTMLInputElement;
        useFilters.set(target.checked);
    }
</script>

<label for="useFilters">use filters:</label>
<input
    type="checkbox"
    id="useFilters"
    on:change={(event) => handleCheck(event)}
    bind:checked={$useFilters}
/>
