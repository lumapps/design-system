import { Moment } from 'moment';
import React from 'react';

import { DatePicker } from '@lumx/react';

const App = () => {
    const LOCALE = 'en';

    const now = new Date();
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);

    const [datePicked, setDatePicked] = React.useState<Date | Moment | string>(now);

    const handleDatePicked = (picked: Moment) => {
        setDatePicked(picked);
    };

    return (
        <div className="demo-grid">
            <DatePicker value={datePicked} locale={LOCALE} onChange={handleDatePicked} minDate={minDate} />
        </div>
    );
};

export default App;
