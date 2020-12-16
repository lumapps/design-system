import { DatePicker } from '@lumx/react';
import React, { useState } from 'react';

export const App = () => {
    const maxDate = new Date();
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    const [datePicked, setDatePicked] = useState<Date | undefined>(new Date());

    return (
        <>
            <DatePicker
                value={datePicked}
                locale="en"
                onChange={setDatePicked}
                minDate={minDate}
                nextButtonProps={{ label: 'Next month' }}
                previousButtonProps={{ label: 'Previous month' }}
            />
            <DatePicker
                value={datePicked}
                locale="en"
                onChange={setDatePicked}
                maxDate={maxDate}
                nextButtonProps={{ label: 'Next month' }}
                previousButtonProps={{ label: 'Previous month' }}
            />
        </>
    );
};
