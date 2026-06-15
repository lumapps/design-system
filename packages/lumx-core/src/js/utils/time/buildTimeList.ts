import { formatTime } from './formatTime';
import { getDateAtTime } from './getDateAtTime';
import { timeOfDayMinutes } from './timeOfDayMinutes';

/**
 * A time-of-day (24h), independent of any date or time zone. Canonical
 * exchange shape for the time utilities and `TimePickerField`.
 */
export interface TimeOfDay {
    /** 0–23 */
    hour: number;
    /** 0–59 */
    minute: number;
    /** Locale-aware short display string. Populated by `buildTimeList` when `locale` is set. */
    name?: string;
    /**
     * `true` when strictly outside `[minTime, maxTime]`. Set by `buildTimeList`;
     * consumers typically forward this as `isDisabled` on the rendered option.
     */
    outOfRange?: boolean;
}

/** Options for `buildTimeList`. */
export interface BuildTimeListOptions {
    /** Positive integer minute interval between entries. @default 30 */
    step?: number;
    /** Lower bound (date part ignored). Entries before are kept but marked `outOfRange`. */
    minTime?: Date;
    /** Upper bound (date part ignored). Entries after are kept but marked `outOfRange`. */
    maxTime?: Date;
    /**
     * Lower bound (date part respected). An entry is disabled when the date-time
     * formed by combining the entry's time with `value`'s date is strictly before
     * `minDateTime`. Requires `value` to be set (otherwise ignored).
     */
    minDateTime?: Date;
    /**
     * Upper bound (date part respected). An entry is disabled when the date-time
     * formed by combining the entry's time with `value`'s date is strictly after
     * `maxDateTime`. Requires `value` to be set (otherwise ignored).
     */
    maxDateTime?: Date;
    /** Current value Date (date part used for `minDateTime`/`maxDateTime` comparison). */
    value?: Date;
    /** BCP-47 locale used to populate `name` on each entry. */
    locale?: string;
}

const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR;

/**
 * Build a full-day list of `TimeOfDay` entries spaced `step` minutes apart.
 * Out-of-bounds entries are kept (with `outOfRange: true`) so consumers can
 * render them as visible-but-unselectable. Returns `[]` for invalid `step`.
 */
export function buildTimeList(options: BuildTimeListOptions = {}): TimeOfDay[] {
    const { step = 30, minTime, maxTime, minDateTime, maxDateTime, value, locale } = options;
    if (!Number.isInteger(step) || step <= 0) {
        return [];
    }

    const minMinutes = minTime ? timeOfDayMinutes(minTime) : undefined;
    const maxMinutes = maxTime ? timeOfDayMinutes(maxTime) : undefined;

    const list: TimeOfDay[] = [];
    for (let minutes = 0; minutes < MINUTES_IN_DAY; minutes += step) {
        const hour = Math.floor(minutes / MINUTES_IN_HOUR);
        const minute = minutes % MINUTES_IN_HOUR;
        const optionTime = { hour, minute };

        const beforeMinTime = minMinutes !== undefined && minutes < minMinutes;
        const afterMaxTime = maxMinutes !== undefined && minutes > maxMinutes;
        let beforeMinDateTime = false;
        let afterMaxDateTime = false;

        if (value && (minDateTime || maxDateTime)) {
            const combined = getDateAtTime(optionTime, value);
            if (minDateTime) beforeMinDateTime = combined < minDateTime;
            if (maxDateTime) afterMaxDateTime = combined > maxDateTime;
        }

        const outOfRange = beforeMinTime || afterMaxTime || beforeMinDateTime || afterMaxDateTime || undefined;
        const name = locale ? formatTime(getDateAtTime(optionTime), locale) : undefined;

        list.push({ hour, minute, name, outOfRange });
    }
    return list;
}
