import { RadioButton, RadioGroup } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('lorem');
    const onChange = (newValue: string) => setValue(newValue);

    return (
        <RadioGroup>
            <RadioButton
                isChecked={value === 'lorem'}
                label="Radio button"
                name="test1"
                theme={theme}
                value="lorem"
                onChange={onChange}
            />

            <RadioButton
                isChecked={value === 'ipsum'}
                helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                label="Radio button with help"
                name="test1"
                theme={theme}
                value="ipsum"
                onChange={onChange}
            />

            <RadioButton
                isChecked={value === 'dolor'}
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
