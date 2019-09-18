import React, { ReactElement, useState } from 'react';

import { TextField, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <TextField>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [value, setValue] = useState('My initial value');

    /**
     * Function called on value change.
     *
     * @param inputValue Value from input.
     */
    const onChange = (inputValue: string): void => {
        setValue(inputValue);
    };

    return (
        <>
            <TextField label="TextField label" value={value} onChange={onChange} theme={theme} />
            <p>Value: {value}</p>
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
