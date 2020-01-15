import React from 'react';

import { DatePickerField } from '@lumx/react';

export default { title: 'DatePicker' };

export const simpleDatePicker = ({ theme }) => {
    const [value, setValue] = React.useState();

    return <DatePickerField locale="fr" label="Start date" theme={theme} onChange={setValue} value={value} />;
};
