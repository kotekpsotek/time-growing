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
        return `
            ${this.days ? this.days + "d" : ""} ${this.hours ? this.hours + "h" : ""} ${this.mins ? this.mins  + "m" : ""} ${this.secs ? this.secs +"s" : ""}
        `.trim().replaceAll(/\s{2,}/gi, " ")
    }
}
