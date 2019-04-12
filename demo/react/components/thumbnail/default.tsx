import React from 'react';

import { Thumbnail, ThumbnailSizes, ThumbnailTheme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ThumbnailTheme;
}

/////////////////////////////

/**
 * The demo for the default <Thumbnail>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ display: 'flex' }}>
            <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.xxs} />
            <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.xs} />
            <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.s} />
            <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.m} />
            <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.l} />
            <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.xl} />
        </div>
    </div>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
