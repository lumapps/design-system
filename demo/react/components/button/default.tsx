import React, { Fragment } from 'react';

import { Button, ButtonEmphasises, ButtonTheme, ButtonThemes } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ButtonTheme;
}

/////////////////////////////

/**
 * The demo for the default <Button>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <Button
            className="mr"
            emphasis={ButtonEmphasises.low}
            color={theme === ButtonThemes.dark ? 'light' : undefined}
            theme={theme}
        >
            Low emphasis
        </Button>

        <Button
            className="mr"
            emphasis={ButtonEmphasises.medium}
            color={theme === ButtonThemes.dark ? 'light' : undefined}
            theme={theme}
        >
            Medium emphasis
        </Button>

        <Button theme={theme}>High emphasis (default)</Button>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
