<script lang="ts">
    import MenuBar from "./parts/MenuBar.svelte";
    import Pine from "$lib/icons/pine.svg"

    type GrowthMinute = Number;
    type GrowthMeter = Number;

    let growthTime = 13;
    let growthRatio: [GrowthMeter, GrowthMinute] = [1, 1];
    let minutesToTransform = 10;
    let timeWithoutUsageAnyP = 13
</script>

<MenuBar/>
<div class="flex flex-col justify-center items-center gap-y-4" style="width: 350px; height: 400px;">
    <div id="circle-wrapper" class="flex justify-center items-center relative font-semibold">
        <div id="circle" class="flex flex-col justify-center items-center gap-y-2 text-white">
            <img src={Pine} alt="Pine Tree" width="75px" height="75px"/>
            <div id="txt" class="gap-y-1">
                <p>
                    <span class="pine-span">Pine</span>
                    is growing
                    <span class="pine-span">{growthTime}m...</span>
                </p>
                <p>
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
            <p class="pine-span">In <span style="font-weight: bold;">{minutesToTransform}m</span> will be transforming to <span style="font-weight: bold;">oak</span></p>
        </div>
    </div>
    <p id="time-non-usage" class="font-bold">
        <span class="pine-span">{timeWithoutUsageAnyP} minutes</span>
        without usage any selected page
    </p>
</div>

<style>
    :root {
        --pine-span: #ACE3E0;
        font-family: Oxygen Bold;
    }
    
    #circle-wrapper {
        width: 300px;
        height: 300px;
        background: conic-gradient(#54B88B 3.6deg, white 0deg);
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
