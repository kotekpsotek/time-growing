<script lang="ts">
    import MenuBar from "./parts/MenuBar.svelte";
    import Pine from "$lib/icons/pine.svg"

    type GrowthMinute = Number;
    type GrowthMeter = Number;

    let growthTime = 13;
    let growthRatio: [GrowthMeter, GrowthMinute] = [1, 1];
</script>

<MenuBar/>
<div class="p-2">
    <div id="circle-wrapper">
        <div id="circle" class="flex flex-col justify-center items-center gap-y-2">
            <img src={Pine} alt="Pine Tree"/>
            <div id="txt">
                <p>
                    <span class="pine-span">Pine</span>
                    is growing
                    <span class="pine-span">{growthTime}</span>
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
    </div>
</div>

<style>
    :root {
        --pine-span: #ACE3E0;
    }
    
    #circle-wrapper {
        width: 250px;
        height: 250px;
        background: conic-gradient(#54B88B 3.6deg, white 0deg);
    }

    #circle {
        width: 98%;
        height: 98%;
        background-color: var(--pine-span);
    }
</style>
