import { DatePicker } from '@lumx/react';
import React, { useState } from 'react';

export const App = ({ today = new Date() }: any) => {
    const [datePicked, setDatePicked] = useState<Date | undefined>(new Date(today));

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
