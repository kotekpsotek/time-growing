<script lang="ts">
    import { getBoost } from "$lib";
    
    let boost: number = 0;

    setInterval(() => {
        boost = getBoost() || 0;
    }, 500)
</script>

{#if boost}
    <p class="font-kalam-regular absolute text-rose-600" style="bottom: -10px; right: -8px;" title="You'll gain 3 trees in same time">x{boost} Boost</p>
{/if}
