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

export type Aims = { [index: string]: string }
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
                    if (originL == origin) {
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
interface LastUsage {
    origin: string,
    timestamp: number
}
type LastUsageList = LastUsage[];
export const lastUsages = (() => {
    const u = writable<LastUsageList>([]);

    return {
        ...u,
        async load() {
            const originsList: LastUsageList = [];

            // Auto update system
            chrome.history.onVisited.addListener(historyItem => {
                const hItemName = historyItem.title || "";
                
                // Only when user has such aim defined means user breaks aim target
                if (aimAddTimeStamps.get(hItemName)) {
                    u.update(c => {
                        const id = c.findIndex(v => v.origin == hItemName);

                        // Reset lasting to now
                        if (id >= 0) {
                            c[id].timestamp = Date.now()
                        }
                        
                        return c;
                    })
                }
            })
            
            // Loading operation depends on aim set definition (content)
            aims.update(v => {
                // Over each aims
                for (const [origin, lastingTime] of Object.entries(v)) {
                    // Check last aim origin visit time
                    chrome.history.getVisits({ url: new URL(origin).toString() })
                    .then(h => {
                        const lastVisitTime = h.reduce((p, c) => {
                            return (p.visitTime || 0) > (c.visitTime || 0) ? p : c;
                        }).visitTime || 0;
                        const thisAimBornTime = aimAddTimeStamps.get(origin);

                        // Time last visit determine how much user is lating in aim completing
                        if (lastVisitTime > thisAimBornTime) {
                            originsList.push(
                                {
                                    origin,
                                    timestamp: lastVisitTime
                                }
                            )
                        }
                        else {
                            // Here user has borken aim
                            originsList.push(
                                {
                                    origin,
                                    timestamp: Date.now()
                                }
                            )
                        }
                    });
                }
                
                return v;
            });

            // Update
            u.update(up_v => originsList);

            console.log(originsList)
        },
        /**
         * @description Get recent usage from all aims timeline
         * @returns 
         */
        recentUsageTimestamp() {
            let recent: number = 0;

            u.update(v => {
                recent = v.reduce((p, c) => p.timestamp > c.timestamp ? p : c).timestamp
                return v;
            });
            
            return recent;
        }
    }
})()
