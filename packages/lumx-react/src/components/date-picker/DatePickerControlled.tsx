import { getRootClassName } from '@lumx/react/utils';
import React from 'react';
import moment from 'moment';

import classNames from 'classnames';

import { Emphasis, IconButton, Toolbar } from '@lumx/react';
import { BaseDatePickerProps } from '@lumx/react/components/date-picker/types';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';

import { getAnnotatedMonthCalendar, getWeekDays } from '@lumx/core/js/date-picker';
import { COMPONENT_PREFIX } from '@lumx/react/constants';

/**
 * Defines the props of the component.
 */
export type DatePickerControlledProps = BaseDatePickerProps & {
    /** Today. */
    today: moment.Moment;

    /** Month offset, positive or negative. */
    monthOffset: number;

    /** Changing to previous month. */
    onPrevMonthChange(): void;

    /** Changing to next month. */
    onNextMonthChange(): void;
};

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}DatePicker`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Simple component used to pick a date (controlled implementation).
 *
 * @return The component.
 */
export const DatePickerControlled: React.FC<DatePickerControlledProps> = ({
    locale,
    maxDate,
    minDate,
    monthOffset,
    onChange,
    onPrevMonthChange,
    onNextMonthChange,
    today,
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
                        {moment(today)
                            .locale(locale)
                            .add(monthOffset, 'months')
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
                    {getAnnotatedMonthCalendar(locale, minDate, maxDate, today, monthOffset).map((annotatedDate) => {
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
                                        onClick={() => onChange(annotatedDate.date)}
                                        type="button"
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
