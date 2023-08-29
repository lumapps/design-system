/**
 * Add a number of months from a date while resetting the day to prevent month length mismatches.
 */
export function addMonthResetDay(date: Date, monthOffset: number) {
    const newDate = new Date(date.getTime());
    newDate.setDate(1);
    newDate.setMonth(date.getMonth() + monthOffset);
    return newDate;
}
