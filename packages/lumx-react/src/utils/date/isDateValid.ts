/**
 * Check if given date is valid.
 */
export const isDateValid = (date?: Date) => date instanceof Date && !Number.isNaN(date.getTime());
