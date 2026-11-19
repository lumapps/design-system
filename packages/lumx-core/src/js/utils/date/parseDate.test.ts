import { formatDate } from './formatDate';
import { getCalendarDate } from './calendarDay';
import { parseDate } from './parseDate';
import { describeInTimeZones } from '../../../testing/timeZones';

const today = new Date(2026, 10, 12, 15, 30);
/** Calendar date (month is 1-based for readability). */
const day = (year: number, month: number, date: number) => getCalendarDate(year, month - 1, date);

describeInTimeZones(parseDate.name, () => {
    describe('long format', () => {
        it('should parse the long format of the locale', () => {
            expect(parseDate('November 12, 2026', 'en-US', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('12 novembre 2026', 'fr-FR', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('12. November 2026', 'de-DE', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('12 de noviembre de 2026', 'es-ES', { today })).toEqual(day(2026, 11, 12));
        });

        it('should parse the text of the formatted value in any locale', () => {
            const date = day(2026, 2, 3);
            for (const locale of [
                'en-US',
                'fr-FR',
                'de-DE',
                'ja-JP',
                'zh-CN',
                'ko-KR',
                'ru-RU',
                'ar-EG',
                'hu-HU',
                'th',
                'fa',
            ]) {
                expect({ locale, date: parseDate(formatDate(date, locale), locale, { today }) }).toEqual({
                    locale,
                    date,
                });
            }
        });

        it('should ignore the case and accept the short month names', () => {
            expect(parseDate('NOVEMBER 12 2026', 'en-US', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('12 nov. 2026', 'fr-FR', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('nov 12 2026', 'en-US', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('12 déc 2026', 'fr-FR', { today })).toEqual(day(2026, 12, 12));
        });

        it('should not confuse month names that contain each other', () => {
            expect(parseDate('12 juillet 2026', 'fr-FR', { today })).toEqual(day(2026, 7, 12));
            expect(parseDate('12 juin 2026', 'fr-FR', { today })).toEqual(day(2026, 6, 12));
            expect(parseDate('2026年11月12日', 'ja-JP', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('2026年1月12日', 'ja-JP', { today })).toEqual(day(2026, 1, 12));
        });

        it('should use the current year without a year', () => {
            expect(parseDate('March 3', 'en-US', { today })).toEqual(day(2026, 3, 3));
            expect(parseDate('3 mars', 'fr-FR', { today })).toEqual(day(2026, 3, 3));
        });

        it('should map a two-digit year', () => {
            expect(parseDate('March 3, 85', 'en-US', { today })).toEqual(day(1985, 3, 3));
        });
    });

    describe('numeric format', () => {
        it('should parse in the field order of the locale', () => {
            expect(parseDate('12/11/2026', 'fr-FR', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('11/12/2026', 'en-US', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('2026/11/12', 'ja-JP', { today })).toEqual(day(2026, 11, 12));
        });

        it('should accept any non-digit separator', () => {
            expect(parseDate('12.11.2026', 'fr-FR', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('12-11-2026', 'fr-FR', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate(' 12 11 2026 ', 'fr-FR', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('1/2/2026', 'fr-FR', { today })).toEqual(day(2026, 2, 1));
        });

        it('should map a two-digit year to the year nearest to today (50 back, 49 forward)', () => {
            expect(parseDate('12/11/85', 'fr-FR', { today })).toEqual(day(1985, 11, 12));
            expect(parseDate('12/11/26', 'fr-FR', { today })).toEqual(day(2026, 11, 12));
            expect(parseDate('12/11/75', 'fr-FR', { today })).toEqual(day(2075, 11, 12));
            expect(parseDate('12/11/76', 'fr-FR', { today })).toEqual(day(1976, 11, 12));
            expect(parseDate('12/11/00', 'fr-FR', { today })).toEqual(day(2000, 11, 12));
        });

        it('should not map a year with more than two digits', () => {
            expect(parseDate('12/11/026', 'fr-FR', { today })).toEqual(day(26, 11, 12));
        });

        it('should use the current year with a day and a month only', () => {
            expect(parseDate('3/4', 'fr-FR', { today })).toEqual(day(2026, 4, 3));
            expect(parseDate('3/4', 'en-US', { today })).toEqual(day(2026, 3, 4));
        });

        it('should parse the locale digits', () => {
            expect(parseDate('١٢/١١/٢٠٢٦', 'ar-EG', { today })).toEqual(day(2026, 11, 12));
        });
    });

    describe('invalid text', () => {
        it.each([
            ['', 'empty text'],
            ['   ', 'blank text'],
            ['12', 'a single number'],
            ['31/02/2026', 'an impossible date'],
            ['12/13/2026', 'a month out of range'],
            ['0/11/2026', 'day 0'],
            ['12/11/0000', 'year 0'],
            ['12/11/999999', 'a year out of the Date range'],
            ['1/2/3/4', 'too many numbers'],
            ['hello', 'any other text'],
            ['novembre', 'a month name alone'],
            ['12 novembre 2026 10', 'too many numbers with a month name'],
        ])('should reject %j (%s)', (text) => {
            expect(parseDate(text, 'fr-FR', { today })).toBeUndefined();
        });
    });

    it('should return the time of day of a day pick (00:00 UTC)', () => {
        const date = parseDate('12/11/2026', 'fr-FR', { today }) as Date;
        expect(date.getUTCHours()).toBe(0);
        expect(date.getDate()).toBe(12);
    });
});
