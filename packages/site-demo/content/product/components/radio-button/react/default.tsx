import React, { useState } from 'react';

import { RadioButton, RadioGroup } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState('lorem');

    return (
        <>
            <RadioGroup>
                <RadioButton
                    checked={value === 'lorem'}
                    label="Radio button 1"
                    name="test1"
                    theme={theme}
                    value="lorem"
                    onChange={setValue}
                />
                <RadioButton
                    disabled
                    label="Radio button 2"
                    name="test1"
                    theme={theme}
                    value="ipsum"
                />
                <RadioButton
                    checked={value === 'dolor'}
                    name="test1"
                    label="Radio button 3"
                    theme={theme}
                    value="dolor"
                    onChange={setValue}
                />
            </RadioGroup>
        </>
    );
};

export default App;
