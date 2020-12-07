import React, { useState } from 'react';

import { DatePickerField } from '@lumx/react';

export default { title: 'LumX components/date-picker/DatePickerField' };

export const Simple = ({ theme }: any) => {
    const [value, setValue] = useState<Date | undefined>();

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
    const [value, setValue] = useState<Date | undefined>(new Date('2020-05-18'));

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
    const [value, setValue] = useState<Date | undefined>(new Date('2020-05-18'));

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

export const CustomMonth = ({ theme }: any) => {
    const [value, setValue] = useState<Date | undefined>();

    return (
        <DatePickerField
            locale="fr"
            label="Initialized to 2019 July"
            placeholder="Pick a date"
            theme={theme}
            onChange={setValue}
            value={value}
            defaultMonth={new Date('2019-07-14')}
        />
    );
};

export const With28FebruarySelected = ({ theme }: any) => {
    const [value, setValue] = useState<Date | undefined>(new Date('2019-02-28'));

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
