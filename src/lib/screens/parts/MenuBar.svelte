<script>
    import { Menu, Close } from "carbon-icons-svelte";
    import { createEventDispatcher } from "svelte";

    let menuOpen = false;
    const dsp = createEventDispatcher();
</script>

<div class="p-4 w-full text-white text-medium flex" style="background-color: #D9D9D9; justify-content: flex-end;">
    <button on:click={_ => {menuOpen = !menuOpen; dsp("menu-click")}}>
        {#if !menuOpen}
            <Close size={20} fill="black"/>
        {:else}
            <Menu size={20} fill="black"/>
        {/if}
    </button>
</div>
