import React from 'react';

import moment from 'moment';

import { DatePickerField, DatePickerProps } from '@lumx/react';

export default { title: 'LumX components/DatePickerField' };

export const simple = ({ theme }: any) => {
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

export const withDefaultValue = ({ theme }: any) => {
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

export const withErrorAndHelper = ({ theme }: any) => {
    const [value, setValue] = React.useState<DatePickerProps['value']>();

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
