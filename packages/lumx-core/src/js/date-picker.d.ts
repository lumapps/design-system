import { Moment } from 'moment';

declare function getWeekDays(locale: string): Moment[];

declare function getMonthCalendar(locale: string, today?: Moment, monthFromNow?: number): Moment[];

type AnnotatedDate = {
    date: Moment;
    isDisplayed: boolean;
    isClickable: boolean;
    isToday: boolean;
};

declare function getAnnotatedMonthCalendar(
    locale: string,
    minDate?: Date,
    maxDate?: Date,
    today?: Moment,
    monthFromNow?: number,
): AnnotatedDate[];

export { getWeekDays, getMonthCalendar, getAnnotatedMonthCalendar };
