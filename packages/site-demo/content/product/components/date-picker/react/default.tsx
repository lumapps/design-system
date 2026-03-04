import { useState } from 'react';
import { DatePicker } from '@lumx/react';

export default () => {
    const [datePicked, setDatePicked] = useState<Date | undefined>(() => new Date());
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
