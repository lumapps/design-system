import React, { Fragment } from 'react';

import { Progress } from 'LumX';

/////////////////////////////

interface IProps {}

/////////////////////////////

/**
 * The demo for the default <Progress>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (): React.ReactElement => (
    <Fragment>
        <Progress />
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
