import { RadioButton, RadioGroup } from '@lumx/react';
import React, { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('lorem');
    const onChange = (newValue: string) => setValue(newValue);

    return (
        <RadioGroup>
            <RadioButton
                checked={value === 'lorem'}
                label="Radio button"
                name="test1"
                theme={theme}
                value="lorem"
                onChange={onChange}
            />

            <RadioButton
                checked={value === 'ipsum'}
                helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                label="Radio button with help"
                name="test1"
                theme={theme}
                value="ipsum"
                onChange={onChange}
            />

            <RadioButton
                checked={value === 'dolor'}
                helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                label="Disabled radio button with help"
                name="test1"
                theme={theme}
                value="dolor"
                onChange={onChange}
                isDisabled
            />
        </RadioGroup>
    );
};
