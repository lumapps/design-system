import { useState } from 'react';
import { DatePicker } from '@lumx/react';

export default ({ today = new Date() }: { today?: Date }) => {
    const [datePicked, setDatePicked] = useState<Date | undefined>(today);
    return (
        <DatePicker
            value={datePicked}
            locale="en"
            onChange={setDatePicked}
            nextButtonProps={{ label: 'Next month' }}
            previousButtonProps={{ label: 'Previous month' }}
        />
    );
};
