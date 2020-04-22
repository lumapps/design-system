import React from 'react';

import moment from 'moment';

import classNames from 'classnames';

import { Emphasis, IconButton, Toolbar } from '@lumx/react';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';

import { getAnnotatedMonthCalendar, getWeekDays } from '@lumx/core/js/date-picker';

import { CLASSNAME, DEFAULT_PROPS, DatePickerProps } from './DatePicker';

/**
 * Defines the props of the component.
 */

type DatePickerControlledProps = DatePickerProps & {
    /** The selected month to display. */
    selectedMonth: moment.Moment;

    /** Changing to previous month. */
    onPrevMonthChange(): void;

    /** Changing to next month. */
    onNextMonthChange(): void;
};

/**
 * The display name of the component.
 */
const COMPONENT_NAME = 'DatePickerControlled';

/**
 * Simple component used to pick a date (controlled implementation).
 *
 * @return The component.
 */
const DatePickerControlled: React.FC<DatePickerControlledProps> = ({
    locale,
    maxDate = DEFAULT_PROPS.maxDate,
    minDate = DEFAULT_PROPS.minDate,
    onChange,
    onPrevMonthChange,
    onNextMonthChange,
    selectedMonth,
    todayOrSelectedDateRef,
    value,
}) => {
    return (
        <div className={`${CLASSNAME}`}>
            <Toolbar
                className={`${CLASSNAME}__toolbar`}
                after={<IconButton emphasis={Emphasis.low} icon={mdiChevronRight} onClick={onNextMonthChange} />}
                before={<IconButton emphasis={Emphasis.low} icon={mdiChevronLeft} onClick={onPrevMonthChange} />}
                label={
                    <span className={`${CLASSNAME}__month`}>
                        {moment(selectedMonth)
                            .locale(locale)
                            .format('MMMM YYYY')}
                    </span>
                }
            />
            <div className={`${CLASSNAME}__calendar`}>
                <div className={`${CLASSNAME}__week-days ${CLASSNAME}__days-wrapper`}>
                    {getWeekDays(locale).map((weekDay) => (
                        <div key={weekDay.unix()} className={`${CLASSNAME}__day-wrapper`}>
                            <span className={`${CLASSNAME}__week-day`}>
                                {weekDay
                                    .format('dddd')
                                    .slice(0, 1)
                                    .toLocaleUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>

                <div className={`${CLASSNAME}__month-days ${CLASSNAME}__days-wrapper`}>
                    {getAnnotatedMonthCalendar(locale, minDate, maxDate, selectedMonth).map((annotatedDate) => {
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
                                        // tslint:disable-next-line: jsx-no-lambda
                                        onClick={() => onChange(annotatedDate.date)}
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
};
DatePickerControlled.displayName = COMPONENT_NAME;

export { CLASSNAME, COMPONENT_NAME, DatePickerControlled, DatePickerControlledProps };
