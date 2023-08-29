import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { DatePickerProps, Emphasis, IconButton, Toolbar } from '@lumx/react';
import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';
import { Comp } from '@lumx/react/utils/type';
import { getMonthCalendar } from '@lumx/react/utils/date/getMonthCalendar';
import { isSameDay } from '@lumx/react/utils/date/isSameDay';
import { parseLocale } from '@lumx/react/utils/locale/parseLocale';
import { Locale } from '@lumx/react/utils/locale/types';
import { CLASSNAME } from './constants';

/**
 * Defines the props of the component.
 */
export interface DatePickerControlledProps extends DatePickerProps {
    /** Selected month to display. */
    selectedMonth: Date;
    /** On previous month change callback. */
    onPrevMonthChange(): void;
    /** On next month change callback. */
    onNextMonthChange(): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'DatePickerControlled';

/**
 * DatePickerControlled component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const DatePickerControlled: Comp<DatePickerControlledProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        locale,
        maxDate,
        minDate,
        nextButtonProps,
        onChange,
        onNextMonthChange,
        onPrevMonthChange,
        previousButtonProps,
        selectedMonth,
        todayOrSelectedDateRef,
        value,
    } = props;
    const { weeks, weekDays } = React.useMemo(() => {
        const localeObj = parseLocale(locale) as Locale;
        return getMonthCalendar(localeObj, selectedMonth, minDate, maxDate);
    }, [locale, minDate, maxDate, selectedMonth]);

    return (
        <div ref={ref} className={`${CLASSNAME}`}>
            <Toolbar
                className={`${CLASSNAME}__toolbar`}
                after={
                    <IconButton
                        {...nextButtonProps}
                        emphasis={Emphasis.low}
                        icon={mdiChevronRight}
                        onClick={onNextMonthChange}
                    />
                }
                before={
                    <IconButton
                        {...previousButtonProps}
                        emphasis={Emphasis.low}
                        icon={mdiChevronLeft}
                        onClick={onPrevMonthChange}
                    />
                }
                label={
                    <span className={`${CLASSNAME}__month`}>
                        {selectedMonth.toLocaleDateString(locale, { year: 'numeric', month: 'long' })}
                    </span>
                }
            />
            <div className={`${CLASSNAME}__calendar`}>
                <div className={`${CLASSNAME}__week-days ${CLASSNAME}__days-wrapper`}>
                    {weekDays.map(({ letter, number }) => (
                        <div key={number} className={`${CLASSNAME}__day-wrapper`}>
                            <span className={`${CLASSNAME}__week-day`}>{letter.toLocaleUpperCase()}</span>
                        </div>
                    ))}
                </div>

                <div className={`${CLASSNAME}__month-days ${CLASSNAME}__days-wrapper`}>
                    {weeks.flatMap((week, weekIndex) => {
                        return weekDays.map((weekDay, dayIndex) => {
                            const { date, isOutOfRange } = week[weekDay.number] || {};
                            const key = `${weekIndex}-${dayIndex}`;
                            const isToday = !isOutOfRange && date && isSameDay(date, new Date());
                            const isSelected = date && value && isSameDay(value, date);

                            return (
                                <div key={key} className={`${CLASSNAME}__day-wrapper`}>
                                    {date && (
                                        <button
                                            ref={isSelected || (!value && isToday) ? todayOrSelectedDateRef : null}
                                            className={classNames(`${CLASSNAME}__month-day`, {
                                                [`${CLASSNAME}__month-day--is-selected`]: isSelected,
                                                [`${CLASSNAME}__month-day--is-today`]: isToday,
                                            })}
                                            disabled={isOutOfRange}
                                            type="button"
                                            onClick={() => onChange(date)}
                                        >
                                            <span>{date.toLocaleDateString(locale, { day: 'numeric' })}</span>
                                        </button>
                                    )}
                                </div>
                            );
                        });
                    })}
                </div>
            </div>
        </div>
    );
});
DatePickerControlled.displayName = COMPONENT_NAME;
DatePickerControlled.className = CLASSNAME;
