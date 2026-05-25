import type { TimeOfDay } from './buildTimeList';

/**
 * Match a free-form time. Supports:
 * - 12h with am/pm suffix (`a`, `am`, `p`, `pm`, `a.m.`, `p.m.`), optional whitespace
 * - 24h with colon (`15:45`), dot (`15.45`), `h` (`15h45`) or no separator (`1545`)
 * - Optional seconds segment (ignored): `15:45:00`, `15.45.00`
 * - Optional ISO `T` prefix and trailing `Z` (UTC marker)
 *
 * Capture groups:
 *   1: hour, 2: minutes (optional), 3: am/pm marker (optional)
 */
const RE_TIME = /^T?(\d{1,2})(?:[:.h]?([0-5]\d)(?:[:.]?[0-5]\d)?)?\s*(a\.?m?\.?|p\.?m?\.?)?Z?$/i;

/**
 * Parse a free-form user time input into a 24h `TimeOfDay`. Accepts a wide
 * range of formats:
 *
 * - 12h AM/PM: `'2pm'`, `'2 PM'`, `'2:30pm'`, `'3.45 PM'`, `'3:45 p.m.'`
 * - 24h colon: `'10:30'`, `'15:45'`
 * - 24h dot (DE/FR/IT): `'15.45'`
 * - 24h French: `'15h45'`
 * - Military / no separator: `'1545'`, `'1030pm'`
 * - With seconds (ignored): `'15:45:00'`
 * - ISO 8601: `'T15:45'`, `'15:45Z'`
 *
 * Whitespace is trimmed. Returns `undefined` if no format matches.
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
