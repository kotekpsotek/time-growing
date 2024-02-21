// place files you want to import through the `$lib` alias in this folder.
export class TimeMeasurement {
    protected now: number;
    timestamp: number;
    days: number;
    hours: number;
    mins: number;
    secs: number
    
    constructor(timestamp: number) {
        this.timestamp = timestamp;
        this.now = Date.now();

        let diff = (this.now - this.timestamp);

        let seconds = diff / 1000;
        this.secs = Math.floor(seconds % 60);
        
        this.mins = Math.floor(seconds / 60) % 60;

        this.hours = Math.floor(seconds / 3600) % 24 

        this.days = Math.floor(seconds / 86_400)
    }

    format(): string {
        const f = `
            ${this.days ? this.days + "d" : ""} ${this.hours ? this.hours + "h" : ""} ${this.mins ? this.mins  + "m" : ""} ${this.secs ? this.secs +"s" : ""}
        `.trim().replaceAll(/\s{2,}/gi, " ")
        return f.length ? f : "0s";
    }
}

import { growthTimeTimeStamp } from "./settings";
import { timeToTreeGain } from "./store";
/** Get tries amount from forest */
export function getForestSize() {
    let forestSize = 0;

    timeToTreeGain.update(u => {
        u.history.forEach(it => {
            if (it.treeType == "Pine") {
                forestSize += 1;
            }
        })
        
        return u;
    })
    
    return forestSize;
}

/** Calculating time to next growth and launch progress visual */
export function timeToNextGrowth(node: HTMLSpanElement) {
    const setupContent = async () => {
        // 
        const timeNextGrowth = await timeToTreeGain.getTimeTo();
        if (node) {
            node.textContent = (Math.round(timeNextGrowth / 1_000)) 
                .toString() + "s";
        }

        //
        const growing = document.getElementById("current-growing");
        if (growing) {
            growing.textContent = String(Math.round((growthTimeTimeStamp - timeNextGrowth) / 1000))
        }

        //
        setupProgress(timeNextGrowth);
    };

    // For current
    setupContent();

    // For new
    setInterval(() => setupContent());

    return {}
}

function setupProgress(timeToTreeGrowth: number): number {
    //         background: conic-gradient(#54B88B 0deg, white 0deg);
    const percentage = getPercentage(timeToTreeGrowth);
    
    const wrapperCircle = document.getElementById("circle-wrapper");
    wrapperCircle?.setAttribute('style', `background: conic-gradient(#54B88B ${percentage}deg, white 0deg)`);

    return percentage;
}

function getPercentage(timeToTreeGrowth: number): number {
    const onePrct = (100 - (timeToTreeGrowth / growthTimeTimeStamp * 100)) * 3.6;
    return onePrct;
}
