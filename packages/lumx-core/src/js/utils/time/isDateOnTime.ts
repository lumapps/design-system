/**
 * Returns `true` when the time-of-day of `date` matches `time` (hour and
 * minute). Seconds and milliseconds are ignored.
 */
export function isDateOnTime(date: Date, time: { hour: number; minute: number }): boolean {
    return date.getHours() === time.hour && date.getMinutes() === time.minute;
}
