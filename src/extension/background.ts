/* import { timeToNextGrowth } from "$lib";

const progressDisplayElement = document.getElementById("timenxt-1/2")!;
setInterval(() => {
    console.log("Element", progressDisplayElement)
})
timeToNextGrowth(progressDisplayElement); */

import { StartedCountingOnNextGrowth, aimAddTimeStamps, lastUsages, timeToTreeGain } from "$lib/store";

chrome.history.onVisited.addListener(async historyItem => {
    const hItemName = historyItem.url || "";
    console.log("Visited Background", hItemName)
    
    // Only when user has such aim defined means user breaks aim target
    /* if (aimAddTimeStamps.get(hItemName)) {
        console.log("Now is used:")
        lastUsages.update(c => {
            const id = c.findIndex(v => v.origin == hItemName || hItemName.includes(v.origin));

            // Reset lasting to now
            if (id >= 0) {
                c[id].timestamp = Date.now()
            }
            
            (async () => {
            })();
            return c;
        })

        // Update time to next pine growing
    } */

    const c: LastUsageList = (await chrome.storage.sync.get("lastusages"))["lastusages"] || [];
    const id = c.findIndex(v => v.origin == hItemName || hItemName.includes(v.origin));

    if (id >= 0) {
        c[id].timestamp = Date.now()
    }

    await chrome.storage.sync.set({"lastusages": c});

    StartedCountingOnNextGrowth.set(true)
        .then(() => console.log("Forbidden bage has been used"));
})

