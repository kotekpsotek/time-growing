<script lang="ts">
	import { currentScreen, aimAddTimeStamps, lastUsages, timeToTreeGain } from "$lib/store";
	import Newcomer from "$lib/screens/Newcomer.svelte";
	import DefineAims from "$lib/screens/DefineAims.svelte";
	import Productivity from "$lib/screens/Productivity.svelte"
    import Forest from "$lib/screens/Forest.svelte";
	import { onMount } from "svelte";

	onMount(async () => {
		await currentScreen.load();
		await aimAddTimeStamps.load();
		await lastUsages.load();
		await timeToTreeGain.load();
	})
</script>

{#if $currentScreen == "newcomer"}
	<Newcomer/>
{:else if $currentScreen == "productivity"}
	<Productivity/>
{:else if $currentScreen == "defineaims"}
	<DefineAims/>
{:else if $currentScreen == "forest"}
	<Forest/>
{/if}
