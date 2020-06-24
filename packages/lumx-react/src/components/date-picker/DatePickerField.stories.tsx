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

export const customMonth = ({ theme }: any) => {
    const [value, setValue] = React.useState<DatePickerProps['value']>();

    return (
        <DatePickerField
            locale="fr"
            label="Initialized to 2019 July"
            placeholder="Pick a date"
            theme={theme}
            onChange={setValue}
            value={value}
            defaultMonth={moment('2019-07-14')}
        />
    );
};

export const withDateObject = ({ theme }: any) => {
    const [value, setValue] = React.useState<DatePickerProps['value']>(new Date('2020-05-18'));

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

export const withCompatibleString = ({ theme }: any) => {
    const [value, setValue] = React.useState<DatePickerProps['value']>('2020-05-22');

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

export const withIncompatibleString = ({ theme }: any) => {
    const [value, setValue] = React.useState<DatePickerProps['value']>('not a real date');

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

export const with28FebruarySelected = ({ theme }: any) => {
    const [value, setValue] = React.useState<DatePickerProps['value']>(new Date('2019-02-28'));

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
