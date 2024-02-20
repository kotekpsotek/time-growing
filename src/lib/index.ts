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
