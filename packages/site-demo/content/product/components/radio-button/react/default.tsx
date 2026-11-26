import { useState } from 'react';
import { RadioButton, RadioGroup, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [value, setValue] = useState('lorem');
    return (
        <RadioGroup value={value} onChange={setValue} name="test1">
            <RadioButton label="Radio button" theme={theme} value="lorem" />

            <RadioButton
                helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                label="Radio button with help"
                theme={theme}
                value="ipsum"
            />

            <RadioButton
                helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                label="Disabled radio button with help"
                theme={theme}
                value="dolor"
                isDisabled
            />
        </RadioGroup>
    );
};
