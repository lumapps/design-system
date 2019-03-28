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
 * The demo for the disabled <Button>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <Button
            className="mr"
            disabled={true}
            emphasis={ButtonEmphasises.low}
            color={theme === ButtonThemes.dark ? 'light' : undefined}
            theme={theme}
        >
            Low emphasis
        </Button>

        <Button
            className="mr"
            disabled={true}
            emphasis={ButtonEmphasises.medium}
            color={theme === ButtonThemes.dark ? 'light' : undefined}
            theme={theme}
        >
            Medium emphasis
        </Button>

        <Button disabled={true} theme={theme}>
            High emphasis (default)
        </Button>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
