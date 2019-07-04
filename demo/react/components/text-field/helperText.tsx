import React, { ReactElement } from 'react';

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
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <TextField helper="Helper text" label="Texfield label" theme={theme} />
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
