import type { TimeOfDay } from './buildTimeList';
import { getDateAtTime } from './getDateAtTime';
import { timeOfDayMinutes } from './timeOfDayMinutes';

export interface SnapTimeToBoundsOptions {
    minTime?: Date;
    maxTime?: Date;
    /** Lower bound (date part respected). Requires `value` for comparison; skipped when value is undefined. */
    minDateTime?: Date;
    /** Upper bound (date part respected). Requires `value` for comparison; skipped when value is undefined. */
    maxDateTime?: Date;
    /** Current value whose date part is inherited for dateTime bounds. When undefined, dateTime bounds are skipped. */
    value?: Date;
}

/**
 * Clamp `time` to `[minTime, maxTime]` and/or `[minDateTime, maxDateTime]`.
 * Inputs strictly before a lower bound snap up; strictly after an upper bound
 * snap down; otherwise returned unchanged.
 *
 * `minTime`/`maxTime` compare by time-of-day only (date part ignored).
 * `minDateTime`/`maxDateTime` compare by full date-time and require `value`
 * (whose date part is inherited) to be set.
 */
export function snapTimeToBounds(time: TimeOfDay, options: SnapTimeToBoundsOptions = {}): TimeOfDay {
    const { minTime, maxTime, minDateTime, maxDateTime, value } = options;
    const totalMinutes = time.hour * 60 + time.minute;

    if (minTime && totalMinutes < timeOfDayMinutes(minTime)) {
        return { hour: minTime.getHours(), minute: minTime.getMinutes() };
    }
    if (maxTime && totalMinutes > timeOfDayMinutes(maxTime)) {
        return { hour: maxTime.getHours(), minute: maxTime.getMinutes() };
    }

    if (value && minDateTime) {
        const combined = getDateAtTime(time, value);
        if (combined < minDateTime) {
            return { hour: minDateTime.getHours(), minute: minDateTime.getMinutes() };
        }
    }
    if (value && maxDateTime) {
        const combined = getDateAtTime(time, value);
        if (combined > maxDateTime) {
            return { hour: maxDateTime.getHours(), minute: maxDateTime.getMinutes() };
        }
    }

    return time;
}
