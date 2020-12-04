import { mdiCalendar } from '@lumx/icons';
import { DatePickerField } from '@lumx/react';
import React, { useState } from 'react';

export const App = () => {
    const [datePicked, setDatePicked] = useState<Date | undefined>(new Date());

    return (
        <DatePickerField
            locale="en"
            label="Pick a date"
            icon={mdiCalendar}
            value={datePicked}
            onChange={setDatePicked}
        />
    );
};
