import React, { ReactElement } from 'react';

import { Progress } from 'LumX';

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
        <Progress />
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
