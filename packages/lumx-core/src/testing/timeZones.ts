import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/** Time zones of the date tests: UTC, a negative offset and a positive offset (offset on 2026-11-04). */
export const TEST_TIME_ZONES = [
    { timeZone: 'UTC', offset: 0 },
    { timeZone: 'America/New_York', offset: 300 },
    { timeZone: 'Asia/Tokyo', offset: -540 },
];

/**
 * Run a test suite in each test time zone.
 *
 * Node applies a new `process.env.TZ` at once. The zone is set in a `beforeAll`, so make the dates in the tests
 * (or in hooks), never in the `describe` body.
 */
export function describeInTimeZones(name: string, suite: (zone: (typeof TEST_TIME_ZONES)[number]) => void) {
    describe.each(TEST_TIME_ZONES)(`${name} in $timeZone`, (zone) => {
        const initialTimeZone = process.env.TZ;
        beforeAll(() => {
            process.env.TZ = zone.timeZone;
        });
        afterAll(() => {
            // `process.env` turns `undefined` into the string 'undefined'.
            if (initialTimeZone === undefined) delete process.env.TZ;
            else process.env.TZ = initialTimeZone;
        });

        it('should run in the time zone', () => {
            expect(new Date(2026, 10, 4).getTimezoneOffset()).toBe(zone.offset);
        });

        suite(zone);
    });
}
