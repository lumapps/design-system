import { buildTimeList } from './buildTimeList';
import { getDateAtTime } from './getDateAtTime';

describe(buildTimeList, () => {
    it('returns 48 entries for the default 30-minute step', () => {
        const list = buildTimeList();
        expect(list).toHaveLength(48);
        expect(list[0]).toMatchObject({ hour: 0, minute: 0, outOfRange: undefined });
        expect(list[1]).toMatchObject({ hour: 0, minute: 30, outOfRange: undefined });
        expect(list[47]).toMatchObject({ hour: 23, minute: 30, outOfRange: undefined });
    });

    it('returns 96 entries for a 15-minute step', () => {
        const list = buildTimeList({ step: 15 });
        expect(list).toHaveLength(96);
        expect(list[2]).toMatchObject({ hour: 0, minute: 30, outOfRange: undefined });
    });

    it('returns 24 entries for a 60-minute step', () => {
        const list = buildTimeList({ step: 60 });
        expect(list).toHaveLength(24);
        expect(list[5]).toMatchObject({ hour: 5, minute: 0, outOfRange: undefined });
    });

    it('returns the single 00:00 entry for a step larger than a day', () => {
        const list = buildTimeList({ step: 2000 });
        expect(list).toHaveLength(1);
        expect(list[0]).toMatchObject({ hour: 0, minute: 0, outOfRange: undefined });
    });

    it('returns an empty list for an invalid step', () => {
        expect(buildTimeList({ step: 0 })).toEqual([]);
        expect(buildTimeList({ step: -10 })).toEqual([]);
        expect(buildTimeList({ step: NaN })).toEqual([]);
        expect(buildTimeList({ step: Infinity })).toEqual([]);
        // Non-integer steps are rejected (would otherwise drift the iteration).
        expect(buildTimeList({ step: 1.5 })).toEqual([]);
    });

    it('marks entries before `minTime` as outOfRange but keeps them in the list', () => {
        const list = buildTimeList({ minTime: getDateAtTime({ hour: 22, minute: 30 }) });
        // Still 48 entries — none are filtered out.
        expect(list).toHaveLength(48);
        expect(list[0]).toMatchObject({ hour: 0, minute: 0, outOfRange: true });
        expect(list[44]).toMatchObject({ hour: 22, minute: 0, outOfRange: true });
        expect(list[45]).toMatchObject({ hour: 22, minute: 30, outOfRange: undefined });
        expect(list[47]).toMatchObject({ hour: 23, minute: 30, outOfRange: undefined });
    });

    it('marks entries after `maxTime` as outOfRange but keeps them in the list', () => {
        const list = buildTimeList({ maxTime: getDateAtTime({ hour: 1, minute: 0 }) });
        expect(list).toHaveLength(48);
        expect(list[0]).toMatchObject({ hour: 0, minute: 0, outOfRange: undefined });
        expect(list[2]).toMatchObject({ hour: 1, minute: 0, outOfRange: undefined });
        expect(list[3]).toMatchObject({ hour: 1, minute: 30, outOfRange: true });
        expect(list[47]).toMatchObject({ hour: 23, minute: 30, outOfRange: true });
    });

    it('marks entries outside both `minTime` and `maxTime` as outOfRange', () => {
        // 09:00 → 10:00 in range, everything else out-of-range.
        const list = buildTimeList({
            minTime: getDateAtTime({ hour: 9, minute: 0 }),
            maxTime: getDateAtTime({ hour: 10, minute: 0 }),
        });
        expect(list).toHaveLength(48);
        const inRange = list.filter((e) => !e.outOfRange);
        expect(inRange).toMatchObject([
            { hour: 9, minute: 0, outOfRange: undefined },
            { hour: 9, minute: 30, outOfRange: undefined },
            { hour: 10, minute: 0, outOfRange: undefined },
        ]);
    });

    it('marks every entry as outOfRange when `minTime` is after `maxTime`', () => {
        const list = buildTimeList({
            minTime: getDateAtTime({ hour: 12, minute: 0 }),
            maxTime: getDateAtTime({ hour: 9, minute: 0 }),
        });
        expect(list).toHaveLength(48);
        expect(list.every((e) => e.outOfRange === true)).toBe(true);
    });

    it('marks a single entry as in range when `minTime` exactly matches a step boundary equal to `maxTime`', () => {
        const list = buildTimeList({
            minTime: getDateAtTime({ hour: 9, minute: 0 }),
            maxTime: getDateAtTime({ hour: 9, minute: 0 }),
        });
        const inRange = list.filter((e) => !e.outOfRange);
        expect(inRange).toMatchObject([{ hour: 9, minute: 0, outOfRange: undefined }]);
    });

    describe('name', () => {
        it('omits `name` when no locale is provided', () => {
            const list = buildTimeList();
            expect(list.every((e) => e.name === undefined)).toBe(true);
        });

        it('populates `name` with a locale-aware short time when `locale` is provided', () => {
            const list = buildTimeList({ step: 60, locale: 'en-US' });
            // 14:00 → "2:00 PM" (Node ICU may use a narrow no-break space U+202F before AM/PM).
            const fourteen = list.find((e) => e.hour === 14)!;
            expect(fourteen.name).toMatch(/^2:00/);
            expect(fourteen.name?.toUpperCase()).toContain('PM');
        });

        it('uses 24-hour formatting for fr-FR', () => {
            const list = buildTimeList({ step: 60, locale: 'fr-FR' });
            const fourteen = list.find((e) => e.hour === 14)!;
            expect(fourteen.name).toMatch(/^14[:hH]00$/);
        });
    });
});
