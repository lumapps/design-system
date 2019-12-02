import React, { ReactElement, useState } from 'react';

import moment from 'moment';

import classNames from 'classnames';

import { Emphasis, IconButton, Toolbar } from '@lumx/react';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';

import { getAnnotatedMonthCalendar, getWeekDays } from '@lumx/core/js/date-picker';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { IGenericProps } from '@lumx/react/utils';
import { getRootClassName } from '../../utils/getRootClassName';

/////////////////////////////

/**
 * Defines the props of the component.
 */

interface IDatePickerProps extends IGenericProps {
    /** Locale. */
    locale: string;

    /** Max date. */
    maxDate?: Date;

    /** Min date. */
    minDate?: Date;

    /** Value. */
    value: Date;

    /** On change. */
    onChange(value: Date): void;
}
type DatePickerProps = IDatePickerProps;

type DatePickerControlledProps = IDatePickerProps & {
    /** Today. */
    today: moment.Moment;

    /** Month offset, positive or negative. */
    monthOffset: number;

    /** Changing month. */
    onMonthChange(newMonth: Date): void;
};

/////////////////////////////

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}DatePicker`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<DatePickerProps> = {
    maxDate: undefined,
    minDate: undefined,
};
/////////////////////////////

/**
 * Simple component used to identify user.
 *
 * @return The component.
 */
const DatePickerControlled: React.FC<DatePickerControlledProps> = ({
    locale,
    maxDate = DEFAULT_PROPS.maxDate,
    minDate = DEFAULT_PROPS.minDate,
    monthOffset,
    today,
}: DatePickerControlledProps): ReactElement => {
    return (
        <div className={`${CLASSNAME}`}>
            <Toolbar
                className={`${CLASSNAME}__toolbar`}
                after={<IconButton emphasis={Emphasis.low} icon={mdiChevronRight} />}
                before={<IconButton emphasis={Emphasis.low} icon={mdiChevronLeft} />}
                label={<span className={`${CLASSNAME}__month`}>Date Picker</span>}
            />
            <div className={`${CLASSNAME}__calendar`}>
                <div className={`${CLASSNAME}__week-days ${CLASSNAME}__days-wrapper`}>
                    {getWeekDays(locale).map((weekDay) => (
                        <div key={weekDay.unix()} className={`${CLASSNAME}__day-wrapper`}>
                            <span className={`${CLASSNAME}__week-day`}>
                                {weekDay
                                    .format('dddd')
                                    .slice(0, 1)
                                    .toUpperCase()}
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
                                        className={classNames(`${CLASSNAME}__month-day`, {
                                            [`${CLASSNAME}__month-day--is-selected`]: annotatedDate.isSelected,
                                            [`${CLASSNAME}__month-day--is-today`]:
                                                annotatedDate.isClickable && annotatedDate.isToday,
                                        })}
                                        disabled={!annotatedDate.isClickable}
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

const DatePicker = (props) => {
    const today = moment();
    const [monthOffset, setMonthOffset] = useState(0);

    return <DatePickerControlled monthOffset={monthOffset} today={today} {...props} />;
};

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, DatePicker, DatePickerProps };
