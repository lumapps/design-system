import React, { Fragment, ReactElement } from 'react';

import { TextField, TextFieldTheme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: TextFieldTheme;
}

/////////////////////////////

/**
 * The demo for the default <TextField>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <Fragment>
        <TextField label="Texfield label" theme={theme} />
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
