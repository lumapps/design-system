import React, { useState } from 'react';

import { RadioButton, RadioGroup } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('lorem');

    return (
        <>
            <RadioGroup>
                <RadioButton
                    checked={value === 'lorem'}
                    label="Radio button"
                    name="test1"
                    theme={theme}
                    value="lorem"
                    onChange={setValue}
                />

                <RadioButton
                    checked={value === 'ipsum'}
                    helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                    label="Radio button with help"
                    name="test1"
                    theme={theme}
                    value="ipsum"
                    onChange={setValue}
                />

                <RadioButton
                    checked={value === 'dolor'}
                    helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                    label="Disabled radio button with help"
                    name="test1"
                    theme={theme}
                    value="dolor"
                    onChange={setValue}
                    disabled
                />
            </RadioGroup>
        </>
    );
};

export default App;
