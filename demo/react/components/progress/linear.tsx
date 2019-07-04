import React, { ReactElement } from 'react';

import { Progress, ProgressVariant } from 'LumX';

/////////////////////////////

interface IProps {}

/////////////////////////////

/**
 * The demo for the default <Progress>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (): ReactElement => (
    <>
        <Progress variant={ProgressVariant.linear} />
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
