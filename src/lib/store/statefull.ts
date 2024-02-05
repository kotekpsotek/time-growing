import { writable } from "svelte/store";

export const currentScreen = writable<"newcomer" | "defineaims" | "launch_screen">("newcomer");
