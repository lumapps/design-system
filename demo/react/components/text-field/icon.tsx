import React, { ReactElement } from 'react';

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
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <TextField icon={mdiMagnify} theme={theme} />
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
