import { formatTime } from './formatTime';

describe(formatTime, () => {
    it('formats a time in 12-hour locale (en-US)', () => {
        // 14:30 → "2:30 PM" (en-US uses 12h with AM/PM by default).
        // ICU may use a narrow no-break space (U+202F) before AM/PM.
        expect(formatTime(new Date(2024, 0, 15, 14, 30), 'en-US')).toMatch(/^2:30\s?(?:PM|pm)/i);
    });

    it('formats a time in 24-hour locale (fr-FR)', () => {
        expect(formatTime(new Date(2024, 0, 15, 14, 30), 'fr-FR')).toMatch(/14[:h]30/);
    });

    it('zero-pads minutes', () => {
        expect(formatTime(new Date(2024, 0, 15, 9, 5), 'en-US')).toMatch(/9:05/);
    });

    it('handles midnight', () => {
        // Locale-dependent: hour: 'numeric' may produce '0:00' or '00:00'.
        expect(formatTime(new Date(2024, 0, 15, 0, 0), 'fr-FR')).toMatch(/^00?[:h]00/);
    });
});
