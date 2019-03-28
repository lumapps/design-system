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
        <Switch className="mb+" helper="Click on the switch to check it" label="With label" theme={theme} />

        <Switch
            helper="Click on the switch to uncheck it"
            checked={true}
            label="Checked by default with label"
            theme={theme}
        />
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
