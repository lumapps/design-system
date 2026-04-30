/**
 * Build a new `Date` with the given time-of-day, inheriting the date part of
 * `reference` (or today). Seconds/ms zeroed; `reference` is not mutated.
 */
export function getDateAtTime({ hour, minute }: { hour: number; minute: number }, reference?: Date): Date {
    const next = reference ? new Date(reference) : new Date();
    next.setHours(hour, minute, 0, 0);
    return next;
}
