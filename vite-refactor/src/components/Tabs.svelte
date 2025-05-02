<script lang="ts">
    import { setContext } from "svelte";
    import { writable } from "svelte/store";

    const activeTab = writable("Info");
    setContext("activeTab", activeTab);
</script>

<div class="content">
    <slot></slot>
    <!-- Content goes here -->
</div>
