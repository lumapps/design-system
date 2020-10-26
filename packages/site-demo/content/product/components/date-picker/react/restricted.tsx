import { DatePicker } from '@lumx/react';
import { Moment } from 'moment';
import React from 'react';

export const App = () => {
    const LOCALE = 'en';
    const now = new Date();
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    const [datePicked, setDatePicked] = React.useState<Date | Moment | string>(now);

    const handleDatePicked = (picked: Moment) => {
        setDatePicked(picked);
    };

    return (
        <>
            <DatePicker value={datePicked} locale={LOCALE} onChange={handleDatePicked} minDate={minDate} />
            <DatePicker value={datePicked} locale={LOCALE} onChange={handleDatePicked} maxDate={now} />
        </>
    );
};
