import { useState } from 'react';
import { RadioButton, RadioGroup, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [value, onChange] = useState<string | undefined>('lorem');
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
