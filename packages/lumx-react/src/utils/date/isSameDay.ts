import { isDateValid } from '@lumx/react/utils/date/isDateValid';

/**
 * Check `date1` is on the same day as `date2`.
 */
export const isSameDay = (date1: Date, date2: Date) =>
    isDateValid(date1) &&
    isDateValid(date2) &&
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
