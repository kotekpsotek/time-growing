<script lang="ts">
    import ActionBar from "./parts/ActionBar.svelte";
    import addIcon from "../icons/add.svg";
    import { currentScreen } from "../store/statefull";

    const aims = {}
    const name: String = "Name"

    function back() {
        $currentScreen = "newcomer"
        
    }

    function ok() {
        // TODO: save here user aims before swap screen
        chrome.storage.sync.set({

        });
    }

    function addNewAim() {
        // TODO:
    }
</script>
<div class="w-aims h-aims">
    <ActionBar>
        <button slot="left" class="text-act-btns font-bold text-lg" on:click={back}>Back</button>
        <button slot="right" class="text-act-btns font-bold text-lg" on:click={ok}>Ok</button>
    </ActionBar>
    <div id="aims-sector">
        <div id="one-stripe" class="flex justify-between items-center">
            <h3 class="text-2xl">Your Aims are here:</h3>
            <button on:click={addNewAim}>
                <img src="{addIcon}" alt="" width="20px" height="20px">
            </button>
        </div>
        {#if Object.entries(aims).length}
            <div id="aims">
                {#each Object.keys(aims) as aimName}
                    <button>
                        <p>{aimName}</p>
                        <p>{aims[aimName]}</p>
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</div>