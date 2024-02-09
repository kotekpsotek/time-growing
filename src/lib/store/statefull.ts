import { writable, derived, type Writable } from "svelte/store";

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
