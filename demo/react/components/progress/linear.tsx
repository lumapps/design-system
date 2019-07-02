import React, { Fragment, ReactElement } from 'react';

import { Progress, Variants } from 'LumX';

/////////////////////////////

interface IProps {}

/////////////////////////////

/**
 * The demo for the default <Progress>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (): ReactElement => (
    <Fragment>
        <Progress variant={Variants.linear} />
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
