import { parseLocale } from '@lumx/react/utils/locale/parseLocale';
import { Locale } from '@lumx/react/utils/locale/types';
import { getWeekDays } from './getWeekDays';

describe(getWeekDays.name, () => {
    const french = parseLocale('fr') as Locale;
    const englishUS = parseLocale('en-us') as Locale;
    const farsi = parseLocale('fa-ir') as Locale;

    it('should list french week days', () => {
        const weekDays = getWeekDays(french);
        expect(weekDays).toEqual([
            { long: 'lundi', letter: 'L', number: 1 },
            { long: 'mardi', letter: 'M', number: 2 },
            { long: 'mercredi', letter: 'M', number: 3 },
            { long: 'jeudi', letter: 'J', number: 4 },
            { long: 'vendredi', letter: 'V', number: 5 },
            { long: 'samedi', letter: 'S', number: 6 },
            { long: 'dimanche', letter: 'D', number: 0 },
        ]);
    });

    it('should list US week days', () => {
        const weekDays = getWeekDays(englishUS);
        expect(weekDays).toEqual([
            { long: 'Sunday', letter: 'S', number: 0 },
            { long: 'Monday', letter: 'M', number: 1 },
            { long: 'Tuesday', letter: 'T', number: 2 },
            { long: 'Wednesday', letter: 'W', number: 3 },
            { long: 'Thursday', letter: 'T', number: 4 },
            { long: 'Friday', letter: 'F', number: 5 },
            { long: 'Saturday', letter: 'S', number: 6 },
        ]);
    });

    it('should list fa-ir week days', () => {
        const weekDays = getWeekDays(farsi);
        expect(weekDays).toEqual([
            { long: 'شنبه', letter: 'ش', number: 6 },
            { long: 'یکشنبه', letter: 'ی', number: 0 },
            { long: 'دوشنبه', letter: 'د', number: 1 },
            { long: 'سه‌شنبه', letter: 'س', number: 2 },
            { long: 'چهارشنبه', letter: 'چ', number: 3 },
            { long: 'پنجشنبه', letter: 'پ', number: 4 },
            { long: 'جمعه', letter: 'ج', number: 5 },
        ]);
    });
});
