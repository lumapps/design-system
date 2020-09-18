import React from 'react';

import { mdiCalendar } from '@lumx/icons';
import { DatePickerField, DatePickerProps } from '@lumx/react';

const App = ({ theme }: any) => {
    const today = new Date();

    const [value, setValue] = React.useState<DatePickerProps['value']>(today);

    return (
        <DatePickerField
            locale="en"
            label="Start date"
            placeholder="Pick a date"
            theme={theme}
            onChange={setValue}
            value={value}
            icon={mdiCalendar}
        />
    );
};

export default App;
