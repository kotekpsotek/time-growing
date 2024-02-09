<script lang="ts">
	import { aims, currentScreen } from "$lib/store/statefull";
	import Newcomer from "$lib/screens/Newcomer.svelte";
	import DefineAims from "$lib/screens/DefineAims.svelte";
	// import Productivity from "$lib/screens/Productivity.svelte"
	import { onMount } from "svelte";

	onMount(async () => {
		await currentScreen.load();
	})
</script>

{#if $currentScreen == "newcomer" || $currentScreen == "productivity"}
	<Newcomer/>
<!-- {:else if $currentScreen == "productivity"}
	<Productivity/> -->
<!-- {/if} -->
{:else if $currentScreen == "defineaims"}
	<DefineAims/>
{/if}
