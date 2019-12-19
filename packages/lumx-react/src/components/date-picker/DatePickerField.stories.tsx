import React from 'react';

import { DatePickerField } from '@lumx/react';

export default { title: 'DatePickerField' };

export const simpleDatePickerField = ({ theme }) => {
    const [value, setValue] = React.useState();

    return <DatePickerField locale="fr" label="Start date" theme={theme} onChange={setValue} value={value} />;
};
