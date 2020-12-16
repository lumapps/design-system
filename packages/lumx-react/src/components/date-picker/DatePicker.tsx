import moment from 'moment';
import React, { forwardRef, useState } from 'react';
import { Comp } from '@lumx/react/utils';
import { CLASSNAME, COMPONENT_NAME } from './constants';
import { DatePickerControlled } from './DatePickerControlled';
import { DatePickerProps } from './types';

/**
 * DatePicker component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const DatePicker: Comp<DatePickerProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { defaultMonth, locale, value, onChange, ...forwardedProps } = props;
    let castedValue;
    if (value) {
        castedValue = moment(value);
    } else if (defaultMonth) {
        castedValue = moment(defaultMonth);
    }
    if (castedValue && !castedValue.isValid()) {
        // eslint-disable-next-line no-console
        console.warn(`[@lumx/react/DatePicker] Invalid date provided ${castedValue}`);
    }
    const selectedDay = castedValue && castedValue.isValid() ? castedValue : moment();

    const [monthOffset, setMonthOffset] = useState(0);

    const setPrevMonth = () => setMonthOffset(monthOffset - 1);
    const setNextMonth = () => setMonthOffset(monthOffset + 1);

    const onDatePickerChange = (newDate?: Date) => {
        onChange(newDate);
        setMonthOffset(0);
    };

    const selectedMonth = moment(selectedDay).locale(locale).add(monthOffset, 'months').toDate();

    return (
        <DatePickerControlled
            ref={ref}
            {...forwardedProps}
            defaultMonth={defaultMonth}
            locale={locale}
            value={value}
            onPrevMonthChange={setPrevMonth}
            onNextMonthChange={setNextMonth}
            selectedMonth={selectedMonth}
            onChange={onDatePickerChange}
        />
    );
});
DatePicker.displayName = COMPONENT_NAME;
DatePicker.className = CLASSNAME;
