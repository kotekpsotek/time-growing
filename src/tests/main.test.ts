import { beforeAll, describe, expect, it } from "vitest";
import { lastUsages } from "../lib/store/statefull";

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
});
