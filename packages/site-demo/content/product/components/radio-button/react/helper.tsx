import React, { useState } from 'react';

import { RadioButton, RadioGroup } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState('lorem');

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
                    onChange={setValue}
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
                    onChange={setValue}
                />
            </RadioGroup>
        </>
    );
};

export default App;
