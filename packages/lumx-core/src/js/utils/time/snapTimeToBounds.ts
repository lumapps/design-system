import type { TimeOfDay } from './buildTimeList';
import { timeOfDayMinutes } from './timeOfDayMinutes';

/**
 * Clamp `time` to `[minTime, maxTime]`. Inputs strictly before `minTime` snap
 * up; inputs strictly after `maxTime` snap down; otherwise returned unchanged.
 * Only the time-of-day of `minTime`/`maxTime` is used.
 */
export function snapTimeToBounds(time: TimeOfDay, minTime?: Date, maxTime?: Date): TimeOfDay {
    const totalMinutes = time.hour * 60 + time.minute;

    if (minTime && totalMinutes < timeOfDayMinutes(minTime)) {
        return { hour: minTime.getHours(), minute: minTime.getMinutes() };
    }
    if (maxTime && totalMinutes > timeOfDayMinutes(maxTime)) {
        return { hour: maxTime.getHours(), minute: maxTime.getMinutes() };
    }
    return time;
}
