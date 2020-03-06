import React, { useState } from 'react';

import moment from 'moment';

import { DatePickerField, DatePickerProps } from '@lumx/react';

export default { title: 'DatePickerField' };

export const Simple = ({ theme }: any) => {
    const [value, setValue] = useState<DatePickerProps['value']>();

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

export const WithDefaultValue = ({ theme }: any) => {
    const [value, setValue] = useState<DatePickerProps['value']>(moment().add(20, 'days'));

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

export const WithErrorAndHelper = ({ theme }: any) => {
    const [value, setValue] = useState<DatePickerProps['value']>();

    return (
        <DatePickerField
            locale="fr"
            label="Start date"
            placeholder="Pick a date"
            theme={theme}
            onChange={setValue}
            value={value}
            hasError
            helper="Helper"
        />
    );
};
