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
    const [value, setValue] = useState('');

    return (
        <TextField
            label="Textfield label"
            placeholder="Placeholder label"
            theme={theme}
            value={value}
            onChange={setValue}
        />
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
