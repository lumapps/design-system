import React, { Fragment } from 'react';

import { Slider, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <Slider>s.
 *
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <Slider theme={theme}>Default Slider</Slider>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
