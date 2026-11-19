import { formatDate, formatDayNumber } from './formatDate';

describe(formatDate, () => {
    it('should format in the long format of the locale', () => {
        const date = new Date(2026, 10, 12);
        expect(formatDate(date, 'en-US')).toBe('November 12, 2026');
        expect(formatDate(date, 'fr-FR')).toBe('12 novembre 2026');
    });

    it('should format in the Gregorian calendar', () => {
        const date = new Date(2026, 10, 12);
        expect(formatDate(date, 'th')).toBe('12 พฤศจิกายน 2026');
        expect(formatDate(date, 'fa')).toBe('۱۲ نوامبر ۲۰۲۶');
    });

    it('should return an empty string without a valid date', () => {
        expect(formatDate(undefined, 'en-US')).toBe('');
        expect(formatDate(new Date('invalid'), 'en-US')).toBe('');
    });
});

describe(formatDayNumber, () => {
    it('should format the day number', () => {
        const date = new Date(2024, 4, 11);
        expect(formatDayNumber(date, 'en')).toEqual('11');
        // Raw format: '11日'.
        expect(formatDayNumber(date, 'ja')).toEqual('11');
        expect(formatDayNumber(date, 'ar-eg')).toEqual('١١');
    });

    it('should format the day number in the Gregorian calendar', () => {
        expect(formatDayNumber(new Date(2024, 4, 11), 'fa')).toEqual('۱۱');
    });
});
