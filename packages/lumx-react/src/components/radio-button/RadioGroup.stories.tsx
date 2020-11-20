import { RadioButton, RadioGroup } from '@lumx/react';
import React, { useState } from 'react';

export default { title: 'LumX components/radio-button/Radio Group' };

export const radioGroup = ({ theme }: any) => {
    const [value, setValue] = useState('lorem');
    const onChange = (newValue: string) => setValue(newValue);

    return (
        <>
            <RadioGroup>
                <RadioButton
                    isChecked={value === 'lorem'}
                    helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                    label="Radio button with help 1"
                    name="test2"
                    theme={theme}
                    value="lorem"
                    onChange={onChange}
                />

                <RadioButton
                    isDisabled
                    helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                    label="Radio button with help 2"
                    name="test2"
                    theme={theme}
                    value="ipsum"
                />

                <RadioButton
                    isChecked={value === 'dolor'}
                    helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                    label="Radio button with help 3"
                    name="test2"
                    theme={theme}
                    value="dolor"
                    onChange={onChange}
                />
            </RadioGroup>
        </>
    );
};
