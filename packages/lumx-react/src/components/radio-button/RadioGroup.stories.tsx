import { RadioButton, RadioGroup } from '@lumx/react';
import React, { useState } from 'react';

export default { title: 'LumX components/radio-button/Radio Group' };

export const Simple = ({ theme }: any) => {
    const [value, onChange] = useState('lorem');

    return (
        <RadioGroup>
            <RadioButton
                isChecked={value === 'lorem'}
                helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                label="Radio button with help 1"
                name="test2"
                theme={theme}
                value="lorem"
                onChange={onChange as any}
            />

            <RadioButton
                isDisabled
                helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                label="Radio button with help 2"
                name="test2"
                theme={theme}
                value="ipsum"
                onChange={onChange as any}
            />

            <RadioButton
                isChecked={value === 'dolor'}
                helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                label="Radio button with help 3"
                name="test2"
                theme={theme}
                value="dolor"
                onChange={onChange as any}
            />
        </RadioGroup>
    );
};
