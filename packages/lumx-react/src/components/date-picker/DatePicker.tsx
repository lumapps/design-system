import React, { RefObject, useState } from 'react';

import moment from 'moment';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { IGenericProps } from '@lumx/react/utils';
import { getRootClassName } from '../../utils/getRootClassName';

import { DatePickerControlled } from './DatePickerControlled';

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

    /** Today or selected date Ref */
    todayOrSelectedDateRef?: RefObject<HTMLButtonElement>;

    /** Value. */
    value: moment.Moment;

    /** On change. */
    onChange(value: moment.Moment): void;
}
type DatePickerProps = IDatePickerProps;

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
 * Simple component used to pick a date (semi-controlled implementation).
 *
 * @return The component.
 */
const DatePicker = (props: DatePickerProps) => {
    const today = moment();
    const [monthOffset, setMonthOffset] = useState(0);

    const setPrevMonth = () => setMonthOffset(monthOffset - 1);
    const setNextMonth = () => setMonthOffset(monthOffset + 1);

    return (
        <DatePickerControlled
            monthOffset={monthOffset}
            today={today}
            onPrevMonthChange={setPrevMonth}
            onNextMonthChange={setNextMonth}
            {...props}
        />
    );
};
DatePicker.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS, DatePicker, DatePickerProps };
