<script>
	import img from "../icons/tree.png"
    import { currentScreen } from "$lib/store/statefull";

	function switchScreen() {
		$currentScreen = "defineaims";
	}
</script>

<div id="canv" class="p-20 flex justify-center items-center">
    <button id="define-aims-switch" class="bg-st-btn border-4 border-st-btn rounded-full" on:click={switchScreen}>
        <div class="flex justify-center">
            <img src="{img}" alt="" width="40px" height="40px">
        </div>
        <p class="font-oxygen-bold text-btn-into">Start your productivity</p>
        <p class="font-dancing-script text-btn-into text-white">Define your aims</p>
    </button>
</div>

<style>	
	#define-aims-switch {
		width: 200px;
		height: 200px;
	}
</style>
