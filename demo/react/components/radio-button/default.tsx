import React, { ReactElement, useState } from 'react';

import { RadioButton, RadioButtonLabel, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <RadioButton>.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [checkedValue, setValue] = useState();
    const handleChange: CallableFunction = (): CallableFunction => ({ value }: { value: string }): void => {
        setValue(value);
    };

    return (
        <>
            <div className="mb+">
                <RadioButton
                    theme={theme}
                    value="lorem"
                    name="test1"
                    onChange={handleChange()}
                    checked={checkedValue === 'lorem'}
                >
                    <RadioButtonLabel>Radio button 1</RadioButtonLabel>
                </RadioButton>
                <RadioButton
                    disabled
                    theme={theme}
                    value="ipsum"
                    name="test1"
                    onChange={handleChange()}
                    checked={checkedValue === 'ispum'}
                >
                    <RadioButtonLabel>Radio button 2</RadioButtonLabel>
                </RadioButton>
                <RadioButton
                    theme={theme}
                    value="dolor"
                    name="test1"
                    onChange={handleChange()}
                    checked={checkedValue === 'dolor'}
                >
                    <RadioButtonLabel>Radio button 3</RadioButtonLabel>
                </RadioButton>
            </div>
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
