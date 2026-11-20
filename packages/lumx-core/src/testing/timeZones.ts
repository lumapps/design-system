import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/**
 * Time zones of the date tests (offset on 2026-11-04): UTC, negative offsets, a positive offset, and a zone that
 * changes its clocks at midnight (no `00:00 UTC` on 2026-03-29 local).
 */
/** `offset`: the `getTimezoneOffset()` minutes, positive west of UTC (ex: `300` in New York). */
export const TEST_TIME_ZONES = [
    { timeZone: 'UTC', offset: 0 },
    { timeZone: 'America/New_York', offset: 300 },
    { timeZone: 'Asia/Tokyo', offset: -540 },
    { timeZone: 'Atlantic/Azores', offset: 60 },
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
