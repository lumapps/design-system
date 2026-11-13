import { formatDate, formatDayNumber } from './formatDate';

describe(formatDate, () => {
    it('should format in the long format of the locale', () => {
        const date = new Date(2026, 10, 12);
        expect(formatDate(date, 'en-US')).toBe('November 12, 2026');
        expect(formatDate(date, 'fr-FR')).toBe('12 novembre 2026');
    });

    it('should return an empty string without a valid date', () => {
        expect(formatDate(undefined, 'en-US')).toBe('');
        expect(formatDate(new Date('invalid'), 'en-US')).toBe('');
    });
});

describe(formatDayNumber, () => {
    it('should format the day number', () => {
        const date = new Date(2024, 4, 11);
        // Standard numerical formatting.
        expect(formatDayNumber('en', date)).toEqual('11');
        // Keep only the numerical part (if any). Raw formatted day number here is '11日'.
        expect(formatDayNumber('ja', date)).toEqual('11');
        // Else Keep the non-numerical formatting
        expect(formatDayNumber('ar-eg', date)).toEqual('١١');
    });
});
