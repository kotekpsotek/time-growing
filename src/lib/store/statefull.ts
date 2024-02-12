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
            console.log("Saved aims", storeV)
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
        }
    }
})();
