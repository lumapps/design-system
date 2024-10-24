import { Locale } from '@lumx/react/utils/locale/types';
import { getFirstDayOfWeek } from './getFirstDayOfWeek';

export type WeekDayInfo = { letter: string; number: number; long: string };

export const DAYS_PER_WEEK = 7;

/**
 * List week days (based on locale) with the week day letter (ex: "M" for "Monday") and week day number
 * (0-based index starting on Sunday).
 */
export const getWeekDays = (locale: Locale): Array<WeekDayInfo> => {
    const iterDate = new Date();
    const firstDay = getFirstDayOfWeek(locale) ?? 1;

    // Go to start of the week
    const offset = firstDay - iterDate.getDay();
    iterDate.setDate(iterDate.getDate() + offset);

    // Iterate through the days of the week
    const weekDays: Array<WeekDayInfo> = [];
    for (let i = 0; i < DAYS_PER_WEEK; i++) {
        // Single letter week day (ex: "M" for "Monday", "L" for "Lundi", etc.)
        const letter = iterDate.toLocaleDateString(locale.code, { weekday: 'narrow' });
        // Weed day long notation
        const long = iterDate.toLocaleDateString(locale.code, { weekday: 'long' });
        // Day number (1-based index starting on Monday)
        const number = iterDate.getDay();

        weekDays.push({ letter, number, long });
        iterDate.setDate(iterDate.getDate() + 1);
    }
    return weekDays;
};
