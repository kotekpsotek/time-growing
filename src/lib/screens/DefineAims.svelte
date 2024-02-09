<script lang="ts">
    import ActionBar from "./parts/ActionBar.svelte";
    import addIcon from "../icons/add.svg";
    import { currentScreen } from "../store/statefull";
    import { writable, type Writable } from "svelte/store";
    import { fade } from "svelte/transition";
    import { CloseOutline, TaskAdd, TrashCan } from "carbon-icons-svelte";
    import Helper from "./parts/Helper.svelte";
    import loadash from "lodash";
    // import { aims } from "../store/statefull";
    import { onDestroy, onMount } from "svelte";

    type ID = string | undefined;
    type FocusOnDeleteButton = boolean;
    
    let tracCanSize = 20 as 24;
    const showDelete: Writable<[boolean, ID, FocusOnDeleteButton]> = writable([false, undefined, false]);

    let aims: { [i: string]: any } = {  }
    let currentScreenX = $currentScreen;

    type TNewAimStorage = [{ aimData: { name: string, mins: number }, launched: boolean, nameElement: null | HTMLInputElement }, typeof aims]
    const NewAimStorage = (() => {
        const aimStartData = {
            name: "",
            mins: 5
        };
        const newAim: Writable<TNewAimStorage> = writable([{
            aimData: Object.assign({}, aimStartData),
            launched: false,
            nameElement: null
        }, Object.assign({}, aims)]);

        return {
            ...newAim,
            init() {
                newAim.update(v => {
                    v[0].launched = true
                    return v;
                });
            },
            add() {
                function save() {
                    $NewAimStorage[1][$NewAimStorage[0].aimData.name] = $NewAimStorage[0].aimData.mins;

                    $NewAimStorage[0].launched = false;
                    $NewAimStorage[0].aimData = Object.assign({}, aimStartData);
                }
                
                if ($NewAimStorage[0].aimData.name.length) {
                    if (Object.keys($NewAimStorage[1]).includes($NewAimStorage[0].aimData.name)) {
                        const overridePermission = confirm(`You've same aim ${$NewAimStorage[0].aimData.name}. Would you like to override?`)
                        
                        if (overridePermission) {
                            save()
                        }
                        else {
                            $NewAimStorage[0].aimData.name = "";
                            // Focus on button here
                            $NewAimStorage[0].nameElement?.focus();
                        }
                    }
                    else save()
                }
                else alert("Pass through aim page!")
            },
            cancel() {
                $NewAimStorage[0].launched = false;
                $NewAimStorage[0].aimData = Object.create({}, aimStartData);
            }
        }
    })()

    function useAutoFocus(node: HTMLInputElement) {
        node.focus()
        return {}
    }

    function mLeaveAim() {
        setTimeout(() => {
            showDelete.update(v => {
                if (!v[2]) {
                    v = [false, undefined, false];
                }
                return v;
            })
        })
    }

    function back() {
        if (!loadash.isEqual($NewAimStorage[1], aimsX)) {
            const permission = confirm("You have made unsaved aims. By going back you will deprive yourself those. Are you sure?")
            if (permission) currentScreenX.goback();
        }
        else currentScreenX.goback()
    }

    function ok() {
        // Save to Persistant storage
        aimsX.update($NewAimStorage[1], true)
            .then(_ => {
                console.log("Saved", $NewAimStorage[1])
                currentScreenX.goback();
            });
    }

    onMount(async () => {
        aimsX = await $aims;
    });
</script>
<div class="w-aims h-aims relative overflow-hidden">
    <ActionBar>
        <button slot="left" class="text-act-btns font-medium text-lg" on:click={back}>Back</button>
        <button slot="right" class="text-act-btns font-medium text-lg" on:click={ok}>Ok</button>
    </ActionBar>
    <div id="aims-sector" class="pt-6 px-2">
        <div id="one-stripe" class="flex justify-between items-center">
            <h3 class="text-2xl font-semibold">Your Aims are here:</h3>
            <button on:click={$NewAimStorage[0].launched ? NewAimStorage.add : NewAimStorage.init}>
                {#if $NewAimStorage[0].launched}
                    <button class="font-semibold text-st-btn flex items-center gap-x-1">
                        <p>Add</p>
                        <TaskAdd size={tracCanSize}/>
                    </button>
                {:else}
                    <img src="{addIcon}" alt="" width="20px" height="20px">
                {/if}
            </button>
        </div>
        <div class="pt-2 relative">
            {#if Object.entries($NewAimStorage[1]).length}
                <div id="aims">
                    {#each Object.keys($NewAimStorage[1]) as aimName, i}
                        <div id="red-hair-couple" class="flex gap-x-1">
                            <button class="w-full flex justify-between bg-cardpx-1" on:mouseenter={_ => $showDelete = [true, aimName, false]} on:mouseleave={mLeaveAim}>
                                <p class="text-st-btn max-w-1/2 font-medium py-2">{aimName}</p>
                                <p class="max-w-5/12 text-center font-semibold py-2">{$NewAimStorage[1][aimName]} minutes</p>
                            </button>
                            {#if $showDelete[0] && $showDelete[1] == aimName}
                                <button class="p-2 bg-zinc-700" on:mouseenter={_ => $showDelete[2] = true} on:mouseleave={_ => $showDelete = [false, undefined, false]} on:click={_ => { delete $NewAimStorage[1][aimName]; $showDelete = [false, undefined, false] }}>
                                    <TrashCan size={tracCanSize} fill="white"/>
                                </button>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
            {#if $NewAimStorage[0].launched}
                <div transition:fade={{ duration: 100 }}>
                    <div class="w-full flex justify-between bg-card py-2 px-1">
                        <input class="w-1/2" type="text" id="webpage-name-inp" placeholder="Webpage e.g. Instagram" bind:value={$NewAimStorage[0].aimData.name} use:useAutoFocus bind:this={$NewAimStorage[0].nameElement}/>
                        <input class="w-2/12 text-center" type="number" min="5" bind:value={$NewAimStorage[0].aimData.mins}/>
                    </div>
                    <button class="absolute right-0 text-red-700 mt-10 flex items-center gap-x-1 font-semibold" on:click={NewAimStorage.cancel}>
                        <p>Close</p>
                        <CloseOutline size={20}/>
                    </button>
                </div>
            {/if}
        </div>
    </div>
    <Helper Class="absolute bottom-0 right-0" content="Each achieved aim or overlayed will multiply your growth ratio by 
    1/4 from its goal time"/>
</div>

<style>
    input {
        outline: none;
    }

    #webpage-name-inp {
        @apply caret-act-btns;
        color: green;
    }
    
    #webpage-name-inp::placeholder {
        color: rgb(48, 66, 48);
    }
</style>
