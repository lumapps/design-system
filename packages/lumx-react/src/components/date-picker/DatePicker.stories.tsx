import React from 'react';

import { DatePickerField } from '@lumx/react';

import { decorators } from '@lumx/react/story-block';

export default { title: 'DatePicker', decorators };

export const simpleDatePicker = ({ theme }) => {
    const [value, setValue] = React.useState();

    return <DatePickerField locale="fr" label="Start date" theme={theme} onChange={setValue} value={value} />;
};
