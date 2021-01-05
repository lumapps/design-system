import React, { forwardRef } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { DatePickerProps, Emphasis, IconButton, Toolbar } from '@lumx/react';
import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';
import { getAnnotatedMonthCalendar, getWeekDays } from '@lumx/core/js/date-picker';
import { Comp } from '@lumx/react/utils';
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
    const days = React.useMemo(() => {
        return getAnnotatedMonthCalendar(locale, minDate, maxDate, moment(selectedMonth));
    }, [locale, minDate, maxDate, selectedMonth]);

    const weekDays = React.useMemo(() => {
        return getWeekDays(locale);
    }, [locale]);

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
                        {moment(selectedMonth).locale(locale).format('MMMM YYYY')}
                    </span>
                }
            />
            <div className={`${CLASSNAME}__calendar`}>
                <div className={`${CLASSNAME}__week-days ${CLASSNAME}__days-wrapper`}>
                    {weekDays.map((weekDay) => (
                        <div key={weekDay.unix()} className={`${CLASSNAME}__day-wrapper`}>
                            <span className={`${CLASSNAME}__week-day`}>
                                {weekDay.format('dddd').slice(0, 1).toLocaleUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>

                <div className={`${CLASSNAME}__month-days ${CLASSNAME}__days-wrapper`}>
                    {days.map((annotatedDate) => {
                        if (annotatedDate.isDisplayed) {
                            return (
                                <div key={annotatedDate.date.unix()} className={`${CLASSNAME}__day-wrapper`}>
                                    <button
                                        ref={
                                            (value && annotatedDate.date.isSame(value, 'day')) ||
                                            (!value && annotatedDate.isToday)
                                                ? todayOrSelectedDateRef
                                                : null
                                        }
                                        className={classNames(`${CLASSNAME}__month-day`, {
                                            [`${CLASSNAME}__month-day--is-selected`]:
                                                value && annotatedDate.date.isSame(value, 'day'),
                                            [`${CLASSNAME}__month-day--is-today`]:
                                                annotatedDate.isClickable && annotatedDate.isToday,
                                        })}
                                        disabled={!annotatedDate.isClickable}
                                        type="button"
                                        onClick={() => onChange(moment(annotatedDate.date).toDate())}
                                    >
                                        <span>{annotatedDate.date.format('DD')}</span>
                                    </button>
                                </div>
                            );
                        }
                        return <div key={annotatedDate.date.unix()} className={`${CLASSNAME}__day-wrapper`} />;
                    })}
                </div>
            </div>
        </div>
    );
});
DatePickerControlled.displayName = COMPONENT_NAME;
DatePickerControlled.className = CLASSNAME;
