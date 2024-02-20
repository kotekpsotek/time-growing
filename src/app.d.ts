// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type Aims = { [index: string]: string }
	type LastUsageList = LastUsage[];
	
	interface LastUsage {
		origin: string,
		timestamp: number
	}
	
	interface TreeType {
		type: "Pine" | "None" | "Forbidden Usage", // None - means operational usage or starting usage
		growthTimeTimeStamp: number   
	}
	
	interface TimeTreeGain {
		/** When last tree was gained */
		history: {
			treeType: TreeType["type"],
			timestamp: number
		}[]
	}
}

export {};
