import { beforeAll, describe, expect, it } from "vitest";
import { aimAddTimeStamps, lastUsages, timeToTreeGain } from "../lib/store";
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

    // .. Time to grain
    timeToTreeGain.update(v => {
        return { // To growth one tree is required 20s
            history: [
                {
                    treeType: "Pine",
                    timestamp: Date.now() - 45_000 // 20s ago
                }
            ]
        }
    });
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


describe("Time to tree growth advanced calculation", () => {
    const growthParam = { growthTimeTimeStamp: 20_000, type: "Pine" } as TreeType;
    
    it("Method #1: How much time last to growth -> Always will return time remanding to next growth\n\t(Before refill)", () => {
        const result = timeToTreeGain.getTimeTo() // FIXME: Change made -> Won't be working
        
        expect(result).toBeGreaterThan(14970)
        expect(result).to.be.lessThan(15000)
    });

    it("Method #2: How much time last to growth -> Always will return time remanding to next growth\n\t(After refill)", () => {
        // Before 
        timeToTreeGain.updateT(Date.now(), growthParam)
        
        // After
        const result = timeToTreeGain.getTimeTo() // FIXME: Change made -> Won't be working
        
        expect(result).toBeGreaterThan(19995)
        expect(result).to.be.lessThan(20003)
    });

    it("Deleting from current time", () => {
        const lastUsage = Date.now(); // 5s ago
        timeToTreeGain.updateT(lastUsage, growthParam);
        // console.log(timeToTreeGain.getTimeTo())
    })
})

describe("API Interfaces", () => {
    it("Time formating", () => {
        const mes = new TimeMeasurement(Date.now() - 87000 * 1000);
        console.log(mes.format())
    })
})
