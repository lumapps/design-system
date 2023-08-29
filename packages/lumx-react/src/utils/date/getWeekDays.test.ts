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
            { letter: 'L', number: 1 },
            { letter: 'M', number: 2 },
            { letter: 'M', number: 3 },
            { letter: 'J', number: 4 },
            { letter: 'V', number: 5 },
            { letter: 'S', number: 6 },
            { letter: 'D', number: 0 },
        ]);
    });

    it('should list US week days', () => {
        const weekDays = getWeekDays(englishUS);
        expect(weekDays).toEqual([
            { letter: 'S', number: 0 },
            { letter: 'M', number: 1 },
            { letter: 'T', number: 2 },
            { letter: 'W', number: 3 },
            { letter: 'T', number: 4 },
            { letter: 'F', number: 5 },
            { letter: 'S', number: 6 },
        ]);
    });

    it('should list fa-ir week days', () => {
        const weekDays = getWeekDays(farsi);
        expect(weekDays).toEqual([
            { letter: 'ش', number: 6 },
            { letter: 'ی', number: 0 },
            { letter: 'د', number: 1 },
            { letter: 'س', number: 2 },
            { letter: 'چ', number: 3 },
            { letter: 'پ', number: 4 },
            { letter: 'ج', number: 5 },
        ]);
    });
});
