import { beforeAll, describe, expect, it } from "vitest";
import { aimAddTimeStamps, lastUsages } from "../lib/store/statefull";
import { TimeMeasurement } from "../lib/index";

beforeAll(() => {
    lastUsages.update(v => {
        return [
            {
                origin: "https://facebook.com",
                timestamp: 1200000
            },
            {
                origin: "https://instagram.com",
                timestamp: 1800000
            },
            {
                origin: "https://abc.com",
                timestamp: 1000000
            },
            {
                origin: "https://cdk.com",
                timestamp: 1900000
            },
        ]
    });

    // ..
    aimAddTimeStamps.update(v => {
        return {
            "https://www.amazon.com/": 1000 
        }
    })
});

describe("Storages unit testing", () => {
    it("lastUsages content", () => {
        lastUsages.update(v => {
            console.info(v);
            return v;
        })
    })

    it("lastUsage recent timestamp", () => {
        lastUsages.update(v => {
            const lastU = lastUsages.recentUsageTimestamp(v);
            
            console.log("Last usage was in", lastU);
    
            expect(lastU).toBeGreaterThan(0);

            return v;
        })
    });

    it("Aim born timestams get one origin", () => {
        const origin = aimAddTimeStamps.get("amazon.com");

        expect(origin).toBeTruthy();
    });
});

describe("API Interfaces", () => {
    it("Time formating", () => {
        const mes = new TimeMeasurement(Date.now() - 87000 * 1000);
        console.log(mes.format())
    })
})
