import React, { Fragment } from 'react';

import { Progress, ProgressTheme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ProgressTheme;
}

/////////////////////////////

/**
 * The demo for the default <Progress>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <Progress theme={theme} />
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
