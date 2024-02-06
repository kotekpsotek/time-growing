<script lang="ts">
    import ActionBar from "./parts/ActionBar.svelte";
    import addIcon from "../icons/add.svg";
    import { currentScreen } from "../store/statefull";
    import { writable, type Writable } from "svelte/store";
    import { fade } from "svelte/transition";
    import { CloseOutline, TaskAdd, TrashCan } from "carbon-icons-svelte";

    type ID = string | undefined;
    type FocusOnDeleteButton = boolean;
    
    const showDelete: Writable<[boolean, ID, FocusOnDeleteButton]> = writable([false, undefined, false]);
    let aims: { [id: string]: number | undefined } = {}
    const name: String = "Name"

    function back() {
        $currentScreen = "newcomer"
        
    }

    function ok() {
        // TODO: save here user aims before swap screen
        chrome.storage.sync.set({

        });
    }

    const NewAimStorage = (() => {
        const aimStartData = {
            name: "",
            mins: 5
        };
        const newAim: Writable<{ aimData: { name: string, mins: number }, launched: boolean, nameElement: null | HTMLInputElement }> = writable({
            aimData: Object.assign({}, aimStartData),
            launched: false,
            nameElement: null
        });

        return {
            ...newAim,
            init() {
                newAim.update(v => {
                    v.launched = true
                    return v;
                });
            },
            add() {
                newAim.update(v => {
                    function save() {
                        aims[v.aimData.name] = v.aimData.mins;
                        v.launched = false;
                        v.aimData = Object.assign({}, aimStartData);
                    }
                    
                    if (v.aimData.name.length) {
                        if (Object.keys(aims).includes(v.aimData.name)) {
                            const overridePermission = confirm(`You've same aim ${v.aimData.name}. Would you like to override?`)
                            
                            if (overridePermission) {
                                save()
                            }
                            else {
                                v.aimData.name = "";
                                // Focus on button here
                                v.nameElement?.focus();
                            }
                        }
                        else save()
                    }
                    else alert("Pass through aim page!")
                    return v;
                })
            },
            cancel() {
                $NewAimStorage.launched = false;
                $NewAimStorage.aimData = Object.create({}, aimStartData);
            }
        }
    })()

    function useAutoFocus(node: HTMLInputElement) {
        node.focus()
        return {}
    }

    function mLeaveAim() {
        setTimeout(() => {
            console.log($showDelete)
            showDelete.update(v => {
                if (!v[2]) {
                    v = [false, undefined, false];
                }
                return v;
            })
        })
    }

    function removeAim(aimName: string) {
        return () => {
            // delete aims[aimName];
            // aims = aims;
            console.log(aimName)
        }
    }
</script>
<div class="w-aims h-aims">
    <ActionBar>
        <button slot="left" class="text-act-btns font-medium text-lg" on:click={back}>Back</button>
        <button slot="right" class="text-act-btns font-medium text-lg" on:click={ok}>Ok</button>
    </ActionBar>
    <div id="aims-sector" class="pt-6 px-2">
        <div id="one-stripe" class="flex justify-between items-center">
            <h3 class="text-2xl font-semibold">Your Aims are here:</h3>
            <button on:click={$NewAimStorage.launched ? NewAimStorage.add : NewAimStorage.init}>
                {#if $NewAimStorage.launched}
                    <button class="font-semibold text-st-btn flex items-center gap-x-1">
                        <p>Add</p>
                        <TaskAdd size={20}/>
                    </button>
                {:else}
                    <img src="{addIcon}" alt="" width="20px" height="20px">
                {/if}
            </button>
        </div>
        <div class="pt-2 relative">
            {#if aims && Object.entries(aims).length}
                <div id="aims">
                    {#each Object.keys(aims) as aimName, i}
                        <div id="red-hair-couple" class="flex gap-x-1">
                            <button class="w-full flex justify-between bg-cardpx-1" on:mouseenter={_ => $showDelete = [true, aimName, false]} on:mouseleave={mLeaveAim}>
                                <p class="text-st-btn max-w-1/2 font-medium py-2">{aimName}</p>
                                <p class="max-w-5/12 text-center font-semibold py-2">{aims[aimName]} minutes</p>
                            </button>
                            {#if $showDelete[0] && $showDelete[1] == aimName}
                                <button class="p-2 bg-zinc-700" on:mouseenter={_ => $showDelete[2] = true} on:mouseleave={_ => $showDelete = [false, undefined, false]} on:click={_ => { delete aims[aimName]; $showDelete = [false, undefined, false] }}>
                                    <TrashCan size={22} fill="white"/>
                                </button>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
            {#if $NewAimStorage.launched}
                <div transition:fade={{ duration: 100 }}>
                    <div class="w-full flex justify-between bg-card py-2 px-1">
                        <input class="w-1/2" type="text" id="webpage-name-inp" placeholder="Webpage e.g. Instagram" bind:value={$NewAimStorage.aimData.name} use:useAutoFocus bind:this={$NewAimStorage.nameElement}/>
                        <input class="w-2/12 text-center" type="number" min="5" bind:value={$NewAimStorage.aimData.mins}/>
                    </div>
                    <button class="absolute right-0 text-red-700 mt-10 flex items-center gap-x-1 font-semibold" on:click={NewAimStorage.cancel}>
                        <p>Close</p>
                        <CloseOutline size={20}/>
                    </button>
                </div>
            {/if}
        </div>
    </div>
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
