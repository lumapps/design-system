import moment from 'moment';
import React, { useState } from 'react';

import { COMPONENT_NAME, DatePickerProps } from './base';
import { DatePickerControlled } from './DatePickerControlled';

export const DatePicker: React.FC<DatePickerProps> = ({ defaultMonth, locale, value, ...forwardedProps }) => {
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
        .add(monthOffset, 'months')
        .toDate();

    return (
        <DatePickerControlled
            {...forwardedProps}
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
