import { DatePicker } from '@lumx/react';
import { useState } from 'react';

export const App = (_: any, context: any) => {
    const today = context?.parameters?.today || new Date();
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
