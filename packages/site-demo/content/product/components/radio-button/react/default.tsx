import React, { useState } from 'react';

import { RadioButton, RadioGroup } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('lorem');
    const onChange = (newValue: string) => setValue(newValue);

    return (
        <>
            <RadioGroup>
                <RadioButton
                    isChecked={value === 'lorem'}
                    label="Radio button 1"
                    name="test1"
                    theme={theme}
                    value="lorem"
                    onChange={onChange}
                />

                <RadioButton isDisabled label="Radio button 2" name="test1" theme={theme} value="ipsum" />

                <RadioButton
                    isChecked={value === 'dolor'}
                    name="test1"
                    label="Radio button 3"
                    theme={theme}
                    value="dolor"
                    onChange={onChange}
                />
            </RadioGroup>
        </>
    );
};

export default App;
