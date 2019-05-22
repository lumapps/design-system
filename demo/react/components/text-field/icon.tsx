import React, { Fragment } from 'react';

import { TextField, TextFieldTheme } from 'LumX';
import { mdiMagnify } from 'LumX/icons';

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
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <TextField icon={mdiMagnify} theme={theme} />
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
