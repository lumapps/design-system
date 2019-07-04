import React, { ReactElement, useState } from 'react';

import { Checkbox, CheckboxHelper, CheckboxLabel, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <Checkbox>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [checkboxes, setCheckboxes] = useState<boolean[]>([true, false]);
    const handleChange: CallableFunction = (index: number): CallableFunction => ({
        checked,
    }: {
        checked: boolean;
    }): void => {
        const newCheckboxes: boolean[] = [...checkboxes];

        newCheckboxes[index] = checked;
        setCheckboxes(newCheckboxes);
    };

    return (
        <>
            <div className="mb+">
                <Checkbox checked={checkboxes[0]} onChange={handleChange(0)} theme={theme}>
                    <CheckboxLabel>Checkbox</CheckboxLabel>
                </Checkbox>
            </div>

            <div className="mb+">
                <Checkbox checked={checkboxes[1]} onChange={handleChange(1)} theme={theme}>
                    <CheckboxLabel>Checkbox with help</CheckboxLabel>
                    <CheckboxHelper>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur.
                    </CheckboxHelper>
                </Checkbox>
            </div>

            <div className="mb+">
                <Checkbox checked={checkboxes[1]} onChange={handleChange(1)} theme={theme} disabled>
                    <CheckboxLabel>Disable checkbox with help</CheckboxLabel>
                    <CheckboxHelper>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur.
                    </CheckboxHelper>
                </Checkbox>
            </div>
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
