import React, { ReactElement, useState } from 'react';

import { RadioButton, RadioButtonHelper, RadioButtonLabel, Theme } from 'LumX';

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
                    name="test2"
                    onChange={handleChange()}
                    checked={checkedValue === 'lorem'}
                >
                    <RadioButtonLabel>Radio Button with help 1</RadioButtonLabel>
                    <RadioButtonHelper>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur.
                    </RadioButtonHelper>
                </RadioButton>
                <RadioButton
                    disabled
                    theme={theme}
                    value="ipsum"
                    name="test2"
                    onChange={handleChange()}
                    checked={checkedValue === 'ispum'}
                >
                    <RadioButtonLabel>Radio Button with help 2</RadioButtonLabel>
                    <RadioButtonHelper>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur.
                    </RadioButtonHelper>
                </RadioButton>
                <RadioButton
                    theme={theme}
                    value="dolor"
                    name="test2"
                    onChange={handleChange()}
                    checked={checkedValue === 'dolor'}
                >
                    <RadioButtonLabel>Radio Button with help 3</RadioButtonLabel>
                    <RadioButtonHelper>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur.
                    </RadioButtonHelper>
                </RadioButton>
            </div>
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
