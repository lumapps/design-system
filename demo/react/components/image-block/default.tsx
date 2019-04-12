import React, { Fragment } from 'react';

import { ImageBlock, ImageBlockTheme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ImageBlockTheme;
}

/////////////////////////////

/**
 * The demo for the default <ImageBlock>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <ImageBlock theme={theme} image="https://picsum.photos/640/480/?random" />
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
