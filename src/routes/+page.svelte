<script lang="ts">
	import { currentScreen } from "$lib/store/statefull";
	import Newcomer from "$lib/screens/Newcomer.svelte";
	import DefineAims from "$lib/screens/DefineAims.svelte";
	import Productivity from "$lib/screens/Productivity.svelte"
</script>

{#if $currentScreen == "newcomer" || $currentScreen == "productivity"}
	<Newcomer/>
<!-- {:else if $currentScreen == "productivity"}
	<Productivity/> -->
<!-- {/if} -->
{:else if $currentScreen == "defineaims"}
	<DefineAims/>
{/if}
