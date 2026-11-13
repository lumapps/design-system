import { formatDate } from './formatDate';
import { getCalendarDate } from './calendarDay';
import { parseDate } from './parseDate';

const today = new Date(2026, 10, 12, 15, 30);
const parse = (text: string, locale: string) => parseDate(text, locale, { today });
/** Calendar date (month is 1-based for readability). */
const day = (year: number, month: number, date: number) => getCalendarDate(year, month - 1, date);

describe(parseDate, () => {
    describe('long format', () => {
        it('should parse the long format of the locale', () => {
            expect(parse('November 12, 2026', 'en-US')).toEqual(day(2026, 11, 12));
            expect(parse('12 novembre 2026', 'fr-FR')).toEqual(day(2026, 11, 12));
            expect(parse('12. November 2026', 'de-DE')).toEqual(day(2026, 11, 12));
            expect(parse('12 de noviembre de 2026', 'es-ES')).toEqual(day(2026, 11, 12));
        });

        it('should parse the text of the formatted value in any locale', () => {
            const date = day(2026, 2, 3);
            for (const locale of ['en-US', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN', 'ko-KR', 'ru-RU', 'ar-EG', 'hu-HU']) {
                expect({ locale, date: parse(formatDate(date, locale), locale) }).toEqual({ locale, date });
            }
        });

        it('should ignore the case and accept the short month names', () => {
            expect(parse('NOVEMBER 12 2026', 'en-US')).toEqual(day(2026, 11, 12));
            expect(parse('12 nov. 2026', 'fr-FR')).toEqual(day(2026, 11, 12));
            expect(parse('nov 12 2026', 'en-US')).toEqual(day(2026, 11, 12));
            expect(parse('12 déc 2026', 'fr-FR')).toEqual(day(2026, 12, 12));
        });

        it('should not confuse month names that contain each other', () => {
            expect(parse('12 juillet 2026', 'fr-FR')).toEqual(day(2026, 7, 12));
            expect(parse('12 juin 2026', 'fr-FR')).toEqual(day(2026, 6, 12));
            expect(parse('2026年11月12日', 'ja-JP')).toEqual(day(2026, 11, 12));
            expect(parse('2026年1月12日', 'ja-JP')).toEqual(day(2026, 1, 12));
        });

        it('should use the current year without a year', () => {
            expect(parse('March 3', 'en-US')).toEqual(day(2026, 3, 3));
            expect(parse('3 mars', 'fr-FR')).toEqual(day(2026, 3, 3));
        });

        it('should map a two-digit year', () => {
            expect(parse('March 3, 85', 'en-US')).toEqual(day(1985, 3, 3));
        });
    });

    describe('numeric format', () => {
        it('should parse in the field order of the locale', () => {
            expect(parse('12/11/2026', 'fr-FR')).toEqual(day(2026, 11, 12));
            expect(parse('11/12/2026', 'en-US')).toEqual(day(2026, 11, 12));
            expect(parse('2026/11/12', 'ja-JP')).toEqual(day(2026, 11, 12));
        });

        it('should accept any non-digit separator', () => {
            expect(parse('12.11.2026', 'fr-FR')).toEqual(day(2026, 11, 12));
            expect(parse('12-11-2026', 'fr-FR')).toEqual(day(2026, 11, 12));
            expect(parse(' 12 11 2026 ', 'fr-FR')).toEqual(day(2026, 11, 12));
            expect(parse('1/2/2026', 'fr-FR')).toEqual(day(2026, 2, 1));
        });

        it('should map a two-digit year to the year nearest to today (50 back, 49 forward)', () => {
            expect(parse('12/11/85', 'fr-FR')).toEqual(day(1985, 11, 12));
            expect(parse('12/11/26', 'fr-FR')).toEqual(day(2026, 11, 12));
            expect(parse('12/11/75', 'fr-FR')).toEqual(day(2075, 11, 12));
            expect(parse('12/11/76', 'fr-FR')).toEqual(day(1976, 11, 12));
            expect(parse('12/11/00', 'fr-FR')).toEqual(day(2000, 11, 12));
        });

        it('should use the current year with a day and a month only', () => {
            expect(parse('3/4', 'fr-FR')).toEqual(day(2026, 4, 3));
            expect(parse('3/4', 'en-US')).toEqual(day(2026, 3, 4));
        });

        it('should parse the locale digits', () => {
            expect(parse('١٢/١١/٢٠٢٦', 'ar-EG')).toEqual(day(2026, 11, 12));
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
            ['1/2/3/4', 'too many numbers'],
            ['hello', 'any other text'],
            ['novembre', 'a month name alone'],
            ['12 novembre 2026 10', 'too many numbers with a month name'],
        ])('should reject %j (%s)', (text) => {
            expect(parse(text, 'fr-FR')).toBeUndefined();
        });
    });

    it('should return the time of day of a day pick (00:00 UTC)', () => {
        const date = parse('12/11/2026', 'fr-FR') as Date;
        expect(date.getUTCHours()).toBe(0);
        expect(date.getDate()).toBe(12);
    });
});
