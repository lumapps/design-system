import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName } from '@lumx/react/utils';

import moment from 'moment';
import React, { RefObject, useState } from 'react';

import { DatePickerControlled } from './DatePickerControlled';

/**
 * Defines the props of the component.
 */
export interface DatePickerProps extends GenericProps {
    /** Locale. */
    locale: string;

    /** Max date. */
    maxDate?: Date;

    /** Min date. */
    minDate?: Date;

    /** Today or selected date Ref */
    todayOrSelectedDateRef?: RefObject<HTMLButtonElement>;

    /** Value. */
    value: moment.Moment | undefined;

    /** On change. */
    onChange(value: moment.Moment | undefined): void;
}

/**
 * The display name of the component.
 */
export const COMPONENT_NAME = `${COMPONENT_PREFIX}DatePicker`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<DatePickerProps> = {};

/**
 * Simple component used to pick a date (semi-controlled implementation).
 *
 * @return The component.
 */
export const DatePicker = (props: DatePickerProps) => {
    const { value } = props;
    const today = value || moment();
    const [monthOffset, setMonthOffset] = useState(0);

    const setPrevMonth = () => setMonthOffset(monthOffset - 1);
    const setNextMonth = () => setMonthOffset(monthOffset + 1);

    return (
        <DatePickerControlled
            {...props}
            monthOffset={monthOffset}
            today={today}
            onPrevMonthChange={setPrevMonth}
            onNextMonthChange={setNextMonth}
            value={value}
        />
    );
};
DatePicker.displayName = COMPONENT_NAME;
