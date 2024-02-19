<script lang="ts">
    import MenuBar from "./parts/MenuBar.svelte";
    import { currentScreen, lastUsages, timeToTreeGain } from "$lib/store/statefull";
    import Pine from "$lib/icons/pine.svg"
    import aim from "$lib/icons/aim.svg"
    import forest from "$lib/icons/forest.svg"
    import { onMount } from "svelte";
    import { TimeMeasurement } from "$lib";
    import { growthTimeTimeStamp } from "$lib/settings";
    import { Percentage } from "carbon-icons-svelte";

    type GrowthMinute = Number;
    type GrowthMeter = Number;

    const timeWithoutUsageAnyP = {
        time: 0,
        formatted: ""
    }

    /** Growing time in milliseconds */
    let growthTimeMs = 0;
    let growthRatio: [GrowthMeter, GrowthMinute] = [1, 1];
    
    type MenuItems = {
        name: string,
        icon: string,
        handler: () => void
    }[]
    
    const menuItems: MenuItems = [
        {
            name: "My aims",
            icon: aim,
            handler() {
                $currentScreen = "defineaims"
            }
        },
        {
            name: "My forest",
            icon: forest,
            handler() {
                $currentScreen = "forest"
            }
        }
    ];
    let menuOpen = false;
    function openMenu() {
        menuOpen = !menuOpen;
    }
    
    lastUsages.subscribe(v => {
        timeWithoutUsageAnyP.time = lastUsages.recentUsageTimestamp(v)
        timeWithoutUsageAnyP.formatted = new TimeMeasurement(timeWithoutUsageAnyP.time)
            .format();
    });

    /** From this function **all key functionalities** are invoking */
    function timeToNextGrowth(node: HTMLSpanElement) {
        const setupContent = () => {
            // 
            const timeNextGrowth = timeToTreeGain.getTimeTo({ growthTimeTimeStamp, type: "None" })
            node.textContent = (Math.round(timeNextGrowth / 1_000)) 
                .toString() + "s";

            //
            const growing = document.getElementById("current-growing");
            growing!.textContent = String(Math.round((growthTimeTimeStamp - timeNextGrowth) / 1000))

            //
            setupProgress(timeNextGrowth);
        };

        // For current
        setupContent();

        // For new
        setInterval(() => setupContent());

        return {}
    }

    function setupProgress(timeToTreeGrowth: number) {
        //         background: conic-gradient(#54B88B 0deg, white 0deg);
        const percentage = getPercentage(timeToTreeGrowth);
        
        const wrapperCircle = document.getElementById("circle-wrapper");
        wrapperCircle!.setAttribute('style', `background: conic-gradient(#54B88B ${percentage}deg, white 0deg)`);
    }

    function getPercentage(timeToTreeGrowth: number): number {
        const onePrct = (100 - (timeToTreeGrowth / growthTimeTimeStamp * 100)) * 3.6;
        return onePrct;
    }

    onMount(() => {
        // Loading tries row and 
        setTimeout(() => {
            timeToTreeGain.updateT(timeWithoutUsageAnyP.time, { growthTimeTimeStamp, type: "Pine" })
        }, 100)

        // Updating forest
        setInterval(() => {
            timeToTreeGain.updateT(Date.now(), { growthTimeTimeStamp, type: "Pine" });
        }, growthTimeTimeStamp)
        
        setInterval(() => {
            // How much time last from last usage
            timeWithoutUsageAnyP.formatted = new TimeMeasurement(timeWithoutUsageAnyP.time)
                .format();
        })
    })
</script>

<MenuBar on:menu-click={openMenu}/>
<div class="flex flex-col justify-center items-center gap-y-4 relative" style="width: 350px; height: 400px; font-family: Oxygen Bold;">
    <div id="circle-wrapper" class="flex justify-center items-center relative font-semibold">
        <div id="circle" class="flex flex-col justify-center items-center gap-y-2 text-white">
            <img src={Pine} alt="Pine Tree" width="75px" height="75px"/>
            <div id="txt" class="gap-y-1">
                <p>
                    <span class="pine-span">Pine</span>
                    is growing
                    <span class="pine-span">
                        <span id="current-growing">
                        </span>
                        s...
                    </span>
                </p>
                <p class="text-black" style="font-size: 14px;">
                    growth ratio is
                    <span class="pine-span">
                        {
                            growthRatio.map((v, i) => {
                                switch (i) {
                                    case 0:
                                        return `${v}m`
                                    case 1:
                                        return `${v}min`
                                }
                            })
                            .join("/")
                        }
                    </span>
                </p>
            </div>
        </div>
        <div id="label" class="bg-white rounded-md p-2">
            <p class="pine-span">In <span style="font-weight: bold;" use:timeToNextGrowth></span> will be transforming to <span style="font-weight: bold;">Pine</span></p>
        </div>
    </div>
    <p id="time-non-usage" class="font-bold">
        <span class="pine-span">{timeWithoutUsageAnyP.formatted}</span>
        without usage any selected page
    </p>
    {#if menuOpen}
        <div id="menu-right" class="absolute top-0 right-0 h-full bg-white" style="width: 200px;">
            {#each menuItems as { name, icon, handler }}
                <button class="flex gap-x-2 p-2" on:click={handler}>
                    <p style="font-size: 15px;">{name}</p>
                    <img src="{icon}" alt="" width="20px" height="20px">
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    :root {
        --pine-span: #ACE3E0;
    }
    
    #circle-wrapper {
        width: 300px;
        height: 300px;
        background: conic-gradient(#54B88B 0deg, white 0deg);
        border-radius: 50%;
        font-size: 16px !important;
    }

    #circle {
        width: 95%;
        height: 95%;
        background-color: var(--pine-span);
        border-radius: 50%;
        padding: 4px;
    }

    #label {
        position: absolute;
        bottom: -10px;
        font-size: 10px !important;
    }

    #time-non-usage {
        font-size: 15px !important;
    }

    .pine-span {
        color: #54B88B;
    }
</style>
