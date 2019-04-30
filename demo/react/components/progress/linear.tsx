import React, { Fragment } from 'react';

import { Progress, Variants } from 'LumX';

/////////////////////////////

interface IProps {}

/////////////////////////////

/**
 * The demo for the default <Progress>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = (): React.ReactElement => (
    <Fragment>
        <Progress variant={Variants.linear} />
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
