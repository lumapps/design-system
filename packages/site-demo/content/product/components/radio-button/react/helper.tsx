import React, { useState } from 'react';

import { RadioButton, RadioGroup } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('lorem');
    const onChange = (newValue: string) => setValue(newValue);

    return (
        <>
            <RadioGroup>
                <RadioButton
                    checked={value === 'lorem'}
                    helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                    label="Radio button with help 1"
                    name="test2"
                    theme={theme}
                    value="lorem"
                    onChange={onChange}
                />

                <RadioButton
                    disabled
                    helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                    label="Radio button with help 2"
                    name="test2"
                    theme={theme}
                    value="ipsum"
                />

                <RadioButton
                    checked={value === 'dolor'}
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

export default App;
