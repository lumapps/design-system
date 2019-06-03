import React, { Fragment, useState } from 'react';

import { Checkbox, CheckboxTheme } from 'LumX';
import { CheckboxHelper } from 'LumX/components/checkbox/react/CheckboxHelper';
import { CheckboxLabel } from 'LumX/components/checkbox/react/CheckboxLabel';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: CheckboxTheme;
}

/////////////////////////////

/**
 * The demo for the default <Checkbox>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    const [checkboxes, setCheckboxes]: [boolean[], React.Dispatch<React.SetStateAction<boolean[]>>] = useState([
        true,
        false,
    ]);
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
        <Fragment>
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
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
