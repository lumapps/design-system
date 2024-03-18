import React, { forwardRef, useState } from 'react';
import { Comp } from '@lumx/react/utils/type';
import { addMonthResetDay } from '@lumx/react/utils/date/addMonthResetDay';
import { isDateValid } from '@lumx/react/utils/date/isDateValid';
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

    let referenceDate = value || defaultMonth || new Date();
    if (!isDateValid(referenceDate)) {
        // eslint-disable-next-line no-console
        console.warn(`[@lumx/react/DatePicker] Invalid date provided ${referenceDate}`);
        referenceDate = new Date();
    }

    const [selectedMonth, setSelectedMonth] = useState(referenceDate);
    const setPrevMonth = () => setSelectedMonth((current) => addMonthResetDay(current, -1));
    const setNextMonth = () => setSelectedMonth((current) => addMonthResetDay(current, +1));

    const onDatePickerChange = (newDate?: Date) => {
        onChange(newDate);
    };

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
            onMonthChange={setSelectedMonth}
        />
    );
});
DatePicker.displayName = COMPONENT_NAME;
DatePicker.className = CLASSNAME;
