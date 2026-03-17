import { useState } from 'react';
import { DatePicker } from '@lumx/react';

export default ({ today = new Date() }: { today?: Date }) => {
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
