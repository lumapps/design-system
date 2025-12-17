import { DatePicker } from '@lumx/react';
import { useState } from 'react';

export const App = (_: any, context: any) => {
    const today = context?.parameters?.today || new Date();
    const maxDate = new Date(today);
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() - 1);
    const [datePicked, setDatePicked] = useState<Date | undefined>(maxDate);

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
