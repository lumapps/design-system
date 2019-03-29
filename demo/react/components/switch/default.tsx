import React, { Fragment } from 'react';

import { Switch, SwitchTheme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: SwitchTheme;
}

/////////////////////////////

/**
 * The demo for the default <Switch>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <Switch className="mb+" theme={theme} />

        <Switch className="mb+" theme={theme}>
            Label
        </Switch>

        <Switch className="mb+" checked={true} theme={theme} />

        <Switch checked={true} theme={theme}>
            Checked by default
        </Switch>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
