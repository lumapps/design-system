import React from 'react';

import moment from 'moment';

import { DatePickerField, DatePickerProps } from '@lumx/react';

export default { title: 'DatePickerField' };

export const simpleDatePickerField = ({ theme }: any) => {
    const [value, setValue] = React.useState<DatePickerProps['value']>();

    return (
        <DatePickerField
            locale="fr"
            label="Start date"
            placeholder="Pick a date"
            theme={theme}
            onChange={setValue}
            value={value}
        />
    );
};

export const defaultValueDatePickerField = ({ theme }: any) => {
    const [value, setValue] = React.useState<DatePickerProps['value']>(moment().add(20, 'days'));

    return (
        <DatePickerField
            locale="fr"
            label="Start date"
            placeholder="Pick a date"
            theme={theme}
            onChange={setValue}
            value={value}
        />
    );
};
