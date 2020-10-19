import { Moment } from 'moment';
import React from 'react';

import { mdiCalendar } from '@lumx/icons';
import { DatePickerField } from '@lumx/react';

const App = () => {
    const LOCALE = 'en';

    const now = new Date();

    const [datePicked, setDatePicked] = React.useState<Date | Moment | string>(now);

    const handleDatePicked = (picked: Moment) => {
        setDatePicked(picked);
    };

    return (
        <div className="demo-grid">
            <DatePickerField
                label="Pick a date"
                icon={mdiCalendar}
                value={datePicked}
                locale={LOCALE}
                onChange={handleDatePicked}
            />
        </div>
    );
};

export default App;
