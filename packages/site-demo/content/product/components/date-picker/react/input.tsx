import { mdiCalendar } from '@lumx/icons';
import { DatePickerField } from '@lumx/react';
import { useState } from 'react';

export const App = (_: any, context: any) => {
    const today = context?.parameters?.today || new Date();
    const [datePicked, setDatePicked] = useState<Date | undefined>(today);

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
