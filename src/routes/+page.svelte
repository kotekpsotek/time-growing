<script lang="ts">
	import { currentScreen } from "$lib/store/statefull";
	import Newcomer from "$lib/screens/Newcomer.svelte";
	import DefineAims from "$lib/screens/DefineAims.svelte";
</script>

{#if $currentScreen == "newcomer"}
	<Newcomer/>
{:else if $currentScreen == "defineaims"}
	<DefineAims/>
{/if}
