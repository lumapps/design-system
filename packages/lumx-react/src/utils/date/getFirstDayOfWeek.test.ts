import { Locale } from '@lumx/react/utils/locale/types';
import { parseLocale } from '../locale/parseLocale';
import { getFirstDayOfWeek } from './getFirstDayOfWeek';

describe(getFirstDayOfWeek.name, () => {
    it('should return for a valid locales', () => {
        expect(getFirstDayOfWeek(parseLocale('fa-ir') as Locale)).toBe(6);
        expect(getFirstDayOfWeek(parseLocale('ar-ma') as Locale)).toBe(1);
        expect(getFirstDayOfWeek(parseLocale('ar') as Locale)).toBe(6);
        expect(getFirstDayOfWeek(parseLocale('en') as Locale)).toBe(0);
    });

    it('should return for the lang locale if available', () => {
        // Test for a specific locale and its root locale
        const localeWithRoot = parseLocale('es-ES') as Locale; // Spanish (Spain) with root locale es
        const expectedFirstDay = getFirstDayOfWeek(parseLocale('es') as Locale); // First day for root locale 'es'

        expect(getFirstDayOfWeek(localeWithRoot)).toBe(expectedFirstDay);
    });
});
