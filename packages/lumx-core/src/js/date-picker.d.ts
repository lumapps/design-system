import { Moment } from 'moment';

declare function getWeekDays(locale: string): string[];

declare function getMonthCalendar(locale: string, monthFromNow?: number): Moment[];

type AnnotatedDate = {
    date: Moment;
    isDisplayed: boolean;
    isClickable: boolean;
    isToday: boolean;
};

declare function getAnnotatedMonthCalendar(
    locale: string,
    maxDate?: Date,
    minDate?: Date,
    monthFromNow?: number,
): AnnotatedDate[];

export { getWeekDays, getMonthCalendar, getAnnotatedMonthCalendar };
