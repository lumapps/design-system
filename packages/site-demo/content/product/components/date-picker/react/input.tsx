import { useState } from 'react';
import { mdiCalendar } from '@lumx/icons';
import { DatePickerField } from '@lumx/react';

export default ({ today = new Date() }: { today?: Date }) => {
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
