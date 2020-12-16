import { DatePicker } from '@lumx/react';
import React, { useState } from 'react';

export const App = () => {
    const [datePicked, setDatePicked] = useState<Date | undefined>(new Date());

    return (
        <DatePicker
            value={datePicked}
            locale="en"
            onChange={(newDate?: Date) => {
                setDatePicked(newDate);
            }}
            nextButtonProps={{ label: 'Next month' }}
            previousButtonProps={{ label: 'Previous month' }}
        />
    );
};
