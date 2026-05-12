import type { TimeOfDay } from './buildTimeList';

/**
 * Match a free-form time: optional minutes (with or without `:`) and optional
 * am/pm (`a`, `am`, `p`, `pm`, case-insensitive, optional whitespace).
 * Examples: `'9'`, `'14'`, `'2pm'`, `'10:30'`, `'1030'`, `'1230 PM'`.
 */
const RE_TIME = /^(\d{1,2})(?::?([0-5]\d))?\s*([ap]m?)?$/i;

/**
 * Parse a free-form user time input (e.g. `'9'`, `'2pm'`, `'10:30'`,
 * `'1030pm'`) into a 24h `TimeOfDay`. Whitespace is trimmed; returns
 * `undefined` if no format matches.
 */
export function parseTimeInput(raw: string): TimeOfDay | undefined {
    if (typeof raw !== 'string') return undefined;
    const match = raw.trim().match(RE_TIME);
    if (!match) return undefined;

    const [, rawHour, rawMinute, ampm] = match;
    let hour = Number(rawHour);
    const minute = rawMinute ? Number(rawMinute) : 0;

    if (ampm) {
        // 12h: hour must be 1..12; convert to 24h (12am→0, 12pm→12).
        if (hour < 1 || hour > 12) return undefined;
        const isPm = ampm[0].toLowerCase() === 'p';
        if (hour === 12) hour = isPm ? 12 : 0;
        else if (isPm) hour += 12;
    } else if (hour > 23) {
        // 24h: hour must be 0..23.
        return undefined;
    }

    return { hour, minute };
}
