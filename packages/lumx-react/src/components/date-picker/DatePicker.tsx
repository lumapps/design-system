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
    /** The month to display by default. */
    defaultMonth?: DatePickerValueProp;
    /** The locale (language or region) to use. */
    locale: string;
    /** The date after which no date can be selected. */
    maxDate?: Date;
    /** The date before which no date can be selected. */
    minDate?: Date;
    /** The reference passed to the <button> element if it corresponds to the current date or the selected date. */
    todayOrSelectedDateRef?: RefObject<HTMLButtonElement>;
    /** The current value of the text field. */
    value: DatePickerValueProp;
    /** The function called on change. */
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

const DatePicker: React.FC<DatePickerProps> = ({ defaultMonth, locale, value, ...forwaredProps }) => {
    let castedValue;
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
        .locale(locale)
        .add(monthOffset, 'months');

    return (
        <DatePickerControlled
            {...forwaredProps}
            defaultMonth={defaultMonth}
            locale={locale}
            value={value}
            onPrevMonthChange={setPrevMonth}
            onNextMonthChange={setNextMonth}
            selectedMonth={selectedMonth}
        />
    );
};
DatePicker.displayName = COMPONENT_NAME;
DatePicker.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, COMPONENT_NAME, DatePicker, DatePickerProps };
