import { getForestSize } from "$lib";
import { growthTimeTimeStamp } from "$lib/settings";
import { writable, type Writable } from "svelte/store";

export type Screens = "newcomer" | "defineaims" | "productivity"  | "forest";
export const currentScreen = (() => {
    const store = writable<Screens>();

    return {
        ...store,
        change(to: Screens) {
            store.update(v => to);
        },
        /** 
            @description Load current screen relying on **aims** storage state. Aims are loading before loading this state, so you don't have to load **aims** in seperate operation
        */
        async load() {
            const dependsAims = await aims.load();

            if (!Object.keys(dependsAims).length) {
                currentScreen.change("newcomer");
            }
            else currentScreen.change("productivity");
        }
    }
})();

export const aims = (() => {
    const a_i_m_s = writable<Aims>({});

    return {
        ...a_i_m_s,
        /**
         * @description Load **aims** from **chrome.storage**
        */
        async load() {
            const aimsFromStorage: Aims = (await chrome.storage.sync.get("aims"))["aims"] || {};
            aims.update(v => aimsFromStorage);

            return aimsFromStorage;
        }
    }
})();

/** 
* @description Save timestamp when aim was added (separately)
*/
export const aimAddTimeStamps = (() => {
    const timestamps: Writable<Record<string, number>> = writable({});
    
    return {
        ...timestamps,
        async load() {
            const storeV = (await chrome.storage.sync.get("timeaim"))["timeaim"] || {};
            // console.log("Saved aims", storeV)
            timestamps.update(v => storeV);
        },
        add(origin: string) {
            timestamps.update(v => {
                // Add to local session
                v[origin] = Date.now();

                // Add to chrome storage
                chrome.storage.sync.set({ timeaim: v });

                return v;
            })

        },
        delete(origin: string) {
            timestamps.update(v => {
                delete v[origin];

                // Add to chrome storage
                chrome.storage.sync.set({ timeaim: v });                
                
                return v;
            })
        },
        getAll(): Record<string, number> {
            let all: Record<string, number> = {}

            timestamps.update(v => {
                all = v;
                return v;
            })
            
            return all;
        },
        get(origin: string) {
            let time: number = 0;

            timestamps.update(v => {
                for (const [originL, timeL] of Object.entries(v)) {
                    const originFilter = origin.replaceAll(/\/|https|http|[:]|\s{2,}/g, " ").trim()
                    console.log(originL == origin, originL.includes(originFilter), originFilter, origin, originL)
                    if (originL == origin || originL.includes(originFilter)) {
                        console.log("Matched up!")
                        time = timeL
                        break;
                    }
                }
                
                return v;
            });

            return time;
        }
    }
})();

// 

// AIMS:
// 1. Load origins last usages from history or while don't exist from aims storage
// 2. Method to obtain how much time last from the most narrow usage any origin from a list page
export const lastUsages = (() => {
    const u = writable<LastUsageList>([]);
    
    return {
        ...u,
        async load() {
            // Auto update system
            chrome.history.onVisited.addListener(historyItem => {
                const hItemName = historyItem.url || "";
                console.log("Visited", hItemName)
                
                // Only when user has such aim defined means user breaks aim target
                if (aimAddTimeStamps.get(hItemName)) {
                    console.log("Now is used")
                    u.update(c => {
                        const id = c.findIndex(v => v.origin == hItemName || hItemName.includes(v.origin));

                        // Reset lasting to now
                        if (id >= 0) {
                            c[id].timestamp = Date.now()
                        }
                        
                        chrome.storage.sync.set({"lastusages": c});
                        return c;
                    })

                    // Update time to next pine growing
                    timeToTreeGain.userUsedForbiddenPage();
                }
            })
            
            // Load last usage state from persistant storage
            const cd = (await chrome.storage.sync.get("lastusages"))["lastusages"] || [];
            u.update(c => cd);
        },
        /**
         * @description Get recent usage from all aims timeline
         * @returns 
         */
        recentUsageTimestamp(usage: LastUsageList) {
            let recent: number = 0;

            recent = usage.reduce((p, c) => p.timestamp > c.timestamp ? p : c, { timestamp: 0, origin: "new" }).timestamp
            
            return recent;
        },
        /**
         * @description Save last usage e.g. when user is enshrining new aim
        */
        saveLastUsage(origin: string) {
            u.update(v => {
                v.push({
                    origin,
                    timestamp: Date.now()
                })
                chrome.storage.sync.set({"lastusages": v});
                return v;
            })
        },
        deleteLastUsage(origin: string) {
            u.update(v => {
                v.splice(v.findIndex(v => v.origin == origin), 1);
                chrome.storage.sync.set({"lastusages": v});
                return v;
            })
        }
    }
})()

/**
 * **WARNING:** Listing subscription on this storage will invoke infinite loop. This is due to how curently tries system is working out
*/
export const timeToTreeGain = (() => {
    const c = writable<TimeTreeGain>({ history: [] });
    
    return {
        ...c,
        async load() {
            const treeTime: TimeTreeGain = (await chrome.storage.sync.get("tree-time"))['tree-time'] || { history: [] };
            c.update(_ => treeTime);
        },
        /**
         * 
         * @param actualUTim - time from last any forebidden page usage
         */
        // I would like to pass 
        updateT(actualUTim: number, { growthTimeTimeStamp, type: treeType }: TreeType) {
            // MS difference in timestamp            
            c.update(actualState => {
                // Fullfill history when empty
                if (!actualState?.history.length) {
                    actualState.history.push({
                        treeType: "None",
                        timestamp: actualUTim
                    });
                    // console.log("Enter timestamp", actualUTim)
                }

                // Sort
                actualState.history = actualState.history.sort((a, b) => a.timestamp - b.timestamp)
                
                // Calculation How much time last from when last tree grown
                const lastHist = actualState.history[actualState.history.length - 1];
                // console.log("Last history timestamp: ", Date.now(), lastHist.timestamp, "\n", "Defference:", Date.now() - lastHist.timestamp, )
                const howMuchTimeLastMs = Date.now() - lastHist?.timestamp;
                
                // Add new tree/s to forest
                if (howMuchTimeLastMs >= growthTimeTimeStamp) {
                    const treesNum = Math.floor(howMuchTimeLastMs / growthTimeTimeStamp);

                    for (let i = treesNum; i > 0; i--) {
                        actualState.history.push({
                            treeType: treeType,
                            timestamp: Date.now() - ((i != 1) ? (i * growthTimeTimeStamp) : 0) // Memorial for my time: (Math + Logical mistake) =>
                            //                                                                    Here was mistake whose take mine few hours 
                            //                                                                    Description: While's only one tree or is a last tree from a current date difference shouldn't be removing standby to growth time (growthTimeTimeStamp) because such notion exists only for a past tries occurenes but not for a current tries
                        })

                        // When this tree will have grown
                        if (i == 1) StartedCountingOnNextGrowth.set()
                    }
                }
                
                // Save occurances in storage
                chrome.storage.sync.set({
                    "tree-time": { ...actualState }
                });

                return actualState;
            });
        },
        /**
         * @description This method always will **return time to next tree growth**. ***Warning Working Proof:*** Method does not refill ungrowth trees, use for that `updateT()` method
         * @param param0 
         */
        async getTimeTo(): Promise<number> {
            let time = await StartedCountingOnNextGrowth.get();
            if (!time || time <= Date.now()) time = await StartedCountingOnNextGrowth.set();

            const diffHist = time! - Date.now();

            return diffHist;
        },
        /**
         * Use always after catch user used forbidden page
        */
        userUsedForbiddenPage() {
            timeToTreeGain.update(v => {
                return { history: [...v.history, { treeType: "Forbidden Usage", timestamp: Date.now() }] }
            });
        },
        triesCount: getForestSize,
        getTriesCount: getForestSize
    }
})();

class StartedCountingOnNextGrowth {
    static async get() {
        const time = (await chrome.storage.sync.get("tgn"))["tgn"];

        if (time) {
            return Number(time)
        }

        return;
    }
    
    static async set() {
        let g = await this.get();

        if (!g || Date.now() >= g) {
            console.log("Set")
            await chrome.storage.sync.set({ tgn: Date.now() + growthTimeTimeStamp });
        }

        return g;
    }
}
