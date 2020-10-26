import { DatePicker } from '@lumx/react';
import { Moment } from 'moment';
import React from 'react';

export const App = () => {
    const LOCALE = 'en';
    const now = new Date();
    const [datePicked, setDatePicked] = React.useState<Date | Moment | string>(now);

    const handleDatePicked = (picked: Moment) => {
        setDatePicked(picked);
    };

    return <DatePicker value={datePicked} locale={LOCALE} onChange={handleDatePicked} />;
};
