import { writable, derived, type Writable } from "svelte/store";

export interface AimType { [id: string]: number | undefined };

export const aimsInit = async () => {
    const a = writable<AimType>({});

    const vS = (await chrome.storage.sync.get("aims"))["aims"]
    console.log("Readed", vS)

    a.update(vU => {
        vU = vS;
        return vU;
    })

    a.subscribe(v => {
        console.log("Updated", v);
    });

    return {
        ...a,
        /**
         * @param v 
            * @param persistantSave - That changes will be annotate in chrome storage instantly
            */
        async update(v: AimType, saveByDefault: boolean = false) {
            if (saveByDefault) {
                await chrome.storage.sync.set({
                    v
                });
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
                vReturn = (await chrome.storage.sync.get("aims"))["aims"]
            }

            return vReturn || {};
        }
    }
};
export const aims: Writable<ReturnType<typeof aimsInit>> = writable();

type TCurrentScreen = "newcomer" | "defineaims" | "productivity";
export const currentScreenInit = () => {
    const c = writable<TCurrentScreen>();
    
    // Loading initial
    let a: any;
    aims.update(v => {
        a = v || {};
        return v;
    });
    
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
            // const aimsC = aims.get(true) || {};
            let a: any;
            aims.update(v => {
                a = v || {};
                return v;
            });

            c.update(v => {
                if (!Object.keys(a).length) {
                    v = "newcomer"
                }
                else v = "productivity"

                return v;
            })
        }
    }
}
export let currentScreen: Writable<ReturnType<typeof currentScreenInit>> = writable();
