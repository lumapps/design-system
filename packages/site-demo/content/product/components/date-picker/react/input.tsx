import { mdiCalendar } from '@lumx/icons';
import { DatePickerField } from '@lumx/react';
import React, { useState } from 'react';

export const App = ({ today = new Date() }: any) => {
    const [datePicked, setDatePicked] = useState<Date | undefined>(new Date(today));

    return (
        <DatePickerField
            locale="en"
            label="Pick a date"
            icon={mdiCalendar}
            value={datePicked}
            onChange={setDatePicked}
            nextButtonProps={{ label: 'Next month' }}
            previousButtonProps={{ label: 'Previous month' }}
        />
    );
};
