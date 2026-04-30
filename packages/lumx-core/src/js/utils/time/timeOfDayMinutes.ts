/**
 * Return the time-of-day of `date` in minutes since 00:00 (date part ignored).
 */
export function timeOfDayMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
}
