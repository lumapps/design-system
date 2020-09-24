import React, { RefObject, useState } from 'react';

import moment from 'moment';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps } from '@lumx/react/utils';
import { getRootClassName } from '../../utils/getRootClassName';

import { DatePickerControlled } from './DatePickerControlled';
import DatePickerValueProp from './DatePickerValueProp';

/**
 * Defines the props of the component.
 */

interface DatePickerProps extends GenericProps {
    /** Locale. */
    locale: string;

    /** Max date. */
    maxDate?: Date;

    /** Min date. */
    minDate?: Date;

    /** Today or selected date Ref */
    todayOrSelectedDateRef?: RefObject<HTMLButtonElement>;

    /** Value. */
    value: DatePickerValueProp;

    /** Month to display by default */
    defaultMonth?: DatePickerValueProp;

    /** On change. */
    onChange(value?: moment.Moment): void;
}

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
const DEFAULT_PROPS: Partial<DatePickerProps> = {};

/**
 * Simple component used to pick a date (semi-controlled implementation).
 * @param props See DatePickerProps.
 *
 * @return The component.
 */
const DatePicker = (props: DatePickerProps) => {
    let castedValue;
    const { value, defaultMonth } = props;
    if (value) {
        castedValue = moment(value);
    } else if (defaultMonth) {
        castedValue = moment(defaultMonth);
    }
    if (castedValue && !castedValue.isValid()) {
        console.warn(`[@lumx/react/DatePicker] Invalid date provided ${castedValue}`);
    }
    const today = castedValue && castedValue.isValid() ? castedValue : moment();

    const [monthOffset, setMonthOffset] = useState(0);

    const setPrevMonth = () => setMonthOffset(monthOffset - 1);
    const setNextMonth = () => setMonthOffset(monthOffset + 1);

    const selectedMonth = moment(today)
        .locale(props.locale)
        .add(monthOffset, 'months');

    return (
        <DatePickerControlled
            {...props}
            onPrevMonthChange={setPrevMonth}
            onNextMonthChange={setNextMonth}
            selectedMonth={selectedMonth}
        />
    );
};
DatePicker.displayName = COMPONENT_NAME;
DatePicker.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, COMPONENT_NAME, DatePicker, DatePickerProps };
