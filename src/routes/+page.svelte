<script lang="ts">
	import { currentScreenInit, currentScreen, aimsInit, aims } from "$lib/store/statefull";
	import Newcomer from "$lib/screens/Newcomer.svelte";
	import DefineAims from "$lib/screens/DefineAims.svelte";
	import Productivity from "$lib/screens/Productivity.svelte"
    import { onMount } from "svelte";

	$: screen = undefined as any as ReturnType<typeof currentScreenInit>

	onMount(() => {
		$currentScreen = currentScreenInit();
		$aims = aimsInit();
		
		screen = $currentScreen
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
