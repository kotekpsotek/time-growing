import { writable } from "svelte/store";

export type Screens = "newcomer" | "defineaims" | "productivity";
export const currentScreen = (() => {
    const store = writable<Screens>("newcomer");

    return {
        ...store,
        change(to: Screens) {
            store.update(v => to);
        }
    }
})();
