<script lang="ts">
	import { currentScreenInit, currentScreen } from "$lib/store/statefull";
	import Newcomer from "$lib/screens/Newcomer.svelte";
	import DefineAims from "$lib/screens/DefineAims.svelte";
	import Productivity from "$lib/screens/Productivity.svelte"
    import { onMount } from "svelte";

	onMount(() => {
		$currentScreen = currentScreenInit();
		
	});
</script>

{#if $screen == "newcomer" || $screen == "productivity"}
	<Newcomer/>
<!-- {:else if $screen == "productivity"}
	<Productivity/> -->
<!-- {/if} -->
{:else if $screen == "defineaims"}
	<DefineAims/>
{/if}
