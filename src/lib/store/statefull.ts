import { writable, derived } from "svelte/store";

export interface AimType { [id: string]: number | undefined };

export const aims = (() => {
    const a = writable<AimType>({});

    /* chrome.storage.sync?.get("aims")
    .then((v: AimType) => {
        a.update(vU => {
            vU = v;
            return vU;
        })
    }) */

    return {
        ...a,
        /**
         * @param v 
            * @param persistantSave - That changes will be annotate in chrome storage instantly
            */
        async update(v: AimType, saveByDefault: boolean = false) {
            if (saveByDefault) {
                // await chrome.storage.sync.set({
                //     v
                // });
            }

            a.update(_ => v);
        },
        async get(persistant: boolean = false) {
            let vReturn: AimType = {}
            if (!persistant) {
                a.update(cV => {
                    vReturn = cV;
                    return cV;
                })
                // return v;
            }
            else {
                // vReturn = (await chrome.storage.sync.get("aims"))["aims"]
            }

            return vReturn || {};
        }
    }
})();

export const currentScreen = (() => {
    const c = writable<"newcomer" | "defineaims" | "productivity">();
    
    // Loading initial
    const a = aims.get(true) || {};
    
    c.update(v => {
        if (Object.keys(a).length) {
            return "productivity";
        }
        else return "newcomer";
    })

    return {
        ...c,
        /**
         * @description Perform one step back on preview
        */
        goback() {
            const aimsC = aims.get(true) || {};
            c.update(v => {
                if (!Object.keys(aimsC).length) {
                    v = "newcomer"
                }
                else v = "productivity"

                return v;
            })
        }
    }
})();
