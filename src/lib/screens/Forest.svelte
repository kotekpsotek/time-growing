<script>
    import { currentScreen, aims } from "$lib/store/statefull";
    import ActionBar from "./parts/ActionBar.svelte";
    import forest from "$lib/icons/forest-2.svg";

    let numberTries = 0;

    function back() {
        $currentScreen = Object.keys($aims).length ? "productivity" : "newcomer";
    }
</script>

<div style="width: 637px; height: 555px;">
    <ActionBar>
        <button slot="left" class="text-act-btns font-medium text-lg" on:click={back}>Back</button>
    </ActionBar>
    <div class="w-full h-full flex flex-col gap-y-2 justify-center items-center">
        <div>
            <img src="{forest}" alt="Forest icon" width="250px" height="250px">
        </div>
        <div class="flex flex-col text-center">
            <p style="font-size: 25px;">Your forest has</p>
            <p class="font-bold text-st-btn" style="font-size: 30px;">{numberTries} Pines</p>
        </div>
    </div>
</div>
