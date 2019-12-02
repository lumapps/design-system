import React, { ReactElement } from 'react';

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
}
type DatePickerProps = IDatePickerProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<DatePickerProps> {}

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
const DEFAULT_PROPS: IDefaultPropsType = {
    maxDate: undefined,
    minDate: undefined,
};
/////////////////////////////

/**
 * Simple component used to identify user.
 *
 * @return The component.
 */
const DatePicker: React.FC<DatePickerProps> = ({
    locale,
    maxDate = DEFAULT_PROPS.maxDate,
    minDate = DEFAULT_PROPS.minDate,
}: DatePickerProps): ReactElement => {
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
                        <div className={`${CLASSNAME}__day-wrapper`}>
                            <span className={`${CLASSNAME}__week-day`} key={weekDay}>
                                {weekDay}
                            </span>
                        </div>
                    ))}
                </div>

                <div className={`${CLASSNAME}__month-days ${CLASSNAME}__days-wrapper`}>
                    {getAnnotatedMonthCalendar(locale, minDate, maxDate).map((annotatedDate) => {
                        if (annotatedDate.isDisplayed) {
                            return (
                                <div className={`${CLASSNAME}__day-wrapper`}>
                                    <button
                                        className={classNames(`${CLASSNAME}__month-day`, {
                                            [`${CLASSNAME}__month-day--is-selected`]: annotatedDate.isSelected,
                                            [`${CLASSNAME}__month-day--is-today`]:
                                                annotatedDate.isClickable && annotatedDate.isToday,
                                        })}
                                        key={annotatedDate.date.format()}
                                        disabled={!annotatedDate.isClickable}
                                    >
                                        <span>{annotatedDate.date.format('DD')}</span>
                                    </button>
                                </div>
                            );
                        }
                        return <div className={`${CLASSNAME}__day-wrapper`} key={annotatedDate.date.format()} />;
                    })}
                </div>
            </div>
        </div>
    );
};
DatePicker.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, DatePicker, DatePickerProps };
