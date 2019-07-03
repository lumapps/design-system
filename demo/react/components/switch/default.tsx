import React, { ReactElement } from 'react';

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
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <Switch className="mb+" theme={theme} />

        <Switch className="mb+" theme={theme}>
            Label
        </Switch>

        <Switch className="mb+" checked={true} theme={theme} />

        <Switch checked={true} theme={theme}>
            Checked by default
        </Switch>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
