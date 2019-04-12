import React from 'react';

import { Thumbnail, ThumbnailSizes, ThumbnailTheme, ThumbnailVariants } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ThumbnailTheme;
}

/////////////////////////////

/**
 * The demo for the Rounded <Thumbnail>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ display: 'flex' }}>
            <Thumbnail
                theme={theme}
                image="http://i.pravatar.cc/128"
                size={ThumbnailSizes.xxs}
                variant={ThumbnailVariants.rounded}
            />
            <Thumbnail
                theme={theme}
                image="http://i.pravatar.cc/128"
                size={ThumbnailSizes.xs}
                variant={ThumbnailVariants.rounded}
            />
            <Thumbnail
                theme={theme}
                image="http://i.pravatar.cc/128"
                size={ThumbnailSizes.s}
                variant={ThumbnailVariants.rounded}
            />
            <Thumbnail
                theme={theme}
                image="http://i.pravatar.cc/128"
                size={ThumbnailSizes.m}
                variant={ThumbnailVariants.rounded}
            />
            <Thumbnail
                theme={theme}
                image="http://i.pravatar.cc/128"
                size={ThumbnailSizes.l}
                variant={ThumbnailVariants.rounded}
            />
            <Thumbnail
                theme={theme}
                image="http://i.pravatar.cc/128"
                size={ThumbnailSizes.xl}
                variant={ThumbnailVariants.rounded}
            />
        </div>
    </div>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
