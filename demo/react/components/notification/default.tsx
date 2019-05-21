import React, { Fragment } from 'react';

import { Notification, NotificationTheme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: NotificationTheme;
}

/////////////////////////////

/**
 * The demo for the default <Notification>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <Notification theme={theme}>Default Notification</Notification>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
