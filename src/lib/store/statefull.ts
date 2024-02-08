import { writable } from "svelte/store";

interface AimType { [id: string]: number | undefined };
let chrome: Record<string, any> = {}

export const currentScreen = writable<"newcomer" | "defineaims" | "launch_screen">("newcomer");
export const aims = (() => {
    const a = writable<AimType>({});

    chrome?.storage?.sync?.get("aims")
    .then((v: AimType) => {
        a.update(vU => {
            vU = v;
            return vU;
        })
    })

    return {
        ...a,
        /**
         * @param v 
         * @param persistantSave - That changes will be annotate in chrome storage instantly
         */
        async update(v: AimType, saveByDefault: boolean = false) {
            if (saveByDefault) {
                await chrome?.storage?.sync.set({
                    v
                });
            }

            a.update(_ => v);
        }
    }
})();
