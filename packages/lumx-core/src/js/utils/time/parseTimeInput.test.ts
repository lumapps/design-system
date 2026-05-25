import { parseTimeInput } from './parseTimeInput';

describe(parseTimeInput, () => {
    describe('bare hour (24h)', () => {
        it('parses single-digit hour', () => {
            expect(parseTimeInput('9')).toEqual({ hour: 9, minute: 0 });
        });

        it('parses two-digit hour', () => {
            expect(parseTimeInput('14')).toEqual({ hour: 14, minute: 0 });
        });

        it('parses 0 as midnight', () => {
            expect(parseTimeInput('0')).toEqual({ hour: 0, minute: 0 });
        });

        it('parses 23 as last hour', () => {
            expect(parseTimeInput('23')).toEqual({ hour: 23, minute: 0 });
        });
    });

    describe('hour with am/pm (12h)', () => {
        it('parses "10am"', () => {
            expect(parseTimeInput('10am')).toEqual({ hour: 10, minute: 0 });
        });

        it('parses "2pm"', () => {
            expect(parseTimeInput('2pm')).toEqual({ hour: 14, minute: 0 });
        });

        it('parses "12am" as midnight', () => {
            expect(parseTimeInput('12am')).toEqual({ hour: 0, minute: 0 });
        });

        it('parses "12pm" as noon', () => {
            expect(parseTimeInput('12pm')).toEqual({ hour: 12, minute: 0 });
        });

        it('accepts "p" as a pm shortcut', () => {
            expect(parseTimeInput('5p')).toEqual({ hour: 17, minute: 0 });
        });

        it('accepts "a" as an am shortcut', () => {
            expect(parseTimeInput('5a')).toEqual({ hour: 5, minute: 0 });
        });

        it('accepts whitespace before am/pm', () => {
            expect(parseTimeInput('5 pm')).toEqual({ hour: 17, minute: 0 });
        });
    });

    describe('hour and minutes (24h)', () => {
        it('parses "10:30"', () => {
            expect(parseTimeInput('10:30')).toEqual({ hour: 10, minute: 30 });
        });

        it('parses "1030" (no colon)', () => {
            expect(parseTimeInput('1030')).toEqual({ hour: 10, minute: 30 });
        });

        it('parses "23:59"', () => {
            expect(parseTimeInput('23:59')).toEqual({ hour: 23, minute: 59 });
        });

        it('parses "0:00"', () => {
            expect(parseTimeInput('0:00')).toEqual({ hour: 0, minute: 0 });
        });

        it('parses "12:30" (24h, hour 12)', () => {
            expect(parseTimeInput('12:30')).toEqual({ hour: 12, minute: 30 });
        });
    });

    describe('hour and minutes with am/pm (12h)', () => {
        it('parses "10:30 AM"', () => {
            expect(parseTimeInput('10:30 AM')).toEqual({ hour: 10, minute: 30 });
        });

        it('parses "2:30pm"', () => {
            expect(parseTimeInput('2:30pm')).toEqual({ hour: 14, minute: 30 });
        });

        it('parses "1230pm" (no colon)', () => {
            expect(parseTimeInput('1230pm')).toEqual({ hour: 12, minute: 30 });
        });

        it('parses "12:00am" as midnight', () => {
            expect(parseTimeInput('12:00am')).toEqual({ hour: 0, minute: 0 });
        });

        it('accepts mixed case am/pm suffix', () => {
            expect(parseTimeInput('10:30Am')).toEqual({ hour: 10, minute: 30 });
            expect(parseTimeInput('2:30Pm')).toEqual({ hour: 14, minute: 30 });
        });
    });

    describe('alternate 12h formats', () => {
        it('parses "3:45 PM"', () => {
            expect(parseTimeInput('3:45 PM')).toEqual({ hour: 15, minute: 45 });
        });

        it('parses "3:45 pm"', () => {
            expect(parseTimeInput('3:45 pm')).toEqual({ hour: 15, minute: 45 });
        });

        it('parses "3:45 p.m." (dotted)', () => {
            expect(parseTimeInput('3:45 p.m.')).toEqual({ hour: 15, minute: 45 });
        });

        it('parses "3:45 a.m." (dotted)', () => {
            expect(parseTimeInput('3:45 a.m.')).toEqual({ hour: 3, minute: 45 });
        });

        it('parses "3.45 PM" (UK dot separator)', () => {
            expect(parseTimeInput('3.45 PM')).toEqual({ hour: 15, minute: 45 });
        });

        it('parses "3:45PM" (no space)', () => {
            expect(parseTimeInput('3:45PM')).toEqual({ hour: 15, minute: 45 });
        });
    });

    describe('alternate 24h formats', () => {
        it('parses "15:45" (colon)', () => {
            expect(parseTimeInput('15:45')).toEqual({ hour: 15, minute: 45 });
        });

        it('parses "15.45" (dot, DE/FR/IT)', () => {
            expect(parseTimeInput('15.45')).toEqual({ hour: 15, minute: 45 });
        });

        it('parses "15h45" (French style)', () => {
            expect(parseTimeInput('15h45')).toEqual({ hour: 15, minute: 45 });
        });

        it('parses "1545" (military, no separator)', () => {
            expect(parseTimeInput('1545')).toEqual({ hour: 15, minute: 45 });
        });

        it('parses "15:45:00" (seconds ignored)', () => {
            expect(parseTimeInput('15:45:00')).toEqual({ hour: 15, minute: 45 });
        });

        it('parses "15:45:30" (non-zero seconds ignored)', () => {
            expect(parseTimeInput('15:45:30')).toEqual({ hour: 15, minute: 45 });
        });
    });

    describe('ISO 8601', () => {
        it('parses "T15:45"', () => {
            expect(parseTimeInput('T15:45')).toEqual({ hour: 15, minute: 45 });
        });

        it('parses "15:45Z" (UTC marker)', () => {
            expect(parseTimeInput('15:45Z')).toEqual({ hour: 15, minute: 45 });
        });

        it('parses "T15:45Z"', () => {
            expect(parseTimeInput('T15:45Z')).toEqual({ hour: 15, minute: 45 });
        });
    });

    describe('invalid input', () => {
        it('returns undefined for empty string', () => {
            expect(parseTimeInput('')).toBeUndefined();
        });

        it('returns undefined for non-numeric input', () => {
            expect(parseTimeInput('abc')).toBeUndefined();
        });

        it('returns undefined for hour out of range (24h)', () => {
            expect(parseTimeInput('24')).toBeUndefined();
            expect(parseTimeInput('25')).toBeUndefined();
        });

        it('returns undefined for negative input', () => {
            expect(parseTimeInput('-1')).toBeUndefined();
        });

        it('returns undefined for single-digit minutes', () => {
            // '1:5' would be ambiguous; require zero-padding.
            expect(parseTimeInput('1:5')).toBeUndefined();
        });

        it('returns undefined for minute out of range', () => {
            expect(parseTimeInput('10:65')).toBeUndefined();
        });

        it('returns undefined for non-string input', () => {
            // @ts-expect-error — runtime guard is being tested.
            expect(parseTimeInput(undefined)).toBeUndefined();
            // @ts-expect-error — runtime guard is being tested.
            expect(parseTimeInput(null)).toBeUndefined();
            // @ts-expect-error — runtime guard is being tested.
            expect(parseTimeInput(123)).toBeUndefined();
        });

        it('trims surrounding whitespace before matching', () => {
            expect(parseTimeInput('  10:30  ')).toEqual({ hour: 10, minute: 30 });
            expect(parseTimeInput('\t10:30\n')).toEqual({ hour: 10, minute: 30 });
        });
    });
});
