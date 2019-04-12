import React, { CSSProperties } from 'react';

import { Thumbnail, ThumbnailSizes, ThumbnailTheme, ThumbnailVariants } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ThumbnailTheme;
}

/////////////////////////////
const componentHolder: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 11,
    margin: 8,
};
/**
 * The demo for the Rounded <Thumbnail>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ display: 'flex' }}>
            <div style={componentHolder}>
                <Thumbnail
                    theme={theme}
                    image="http://i.pravatar.cc/128"
                    size={ThumbnailSizes.xxs}
                    variant={ThumbnailVariants.rounded}
                />
                xxs
            </div>
            <div style={componentHolder}>
                <Thumbnail
                    theme={theme}
                    image="http://i.pravatar.cc/128"
                    size={ThumbnailSizes.xs}
                    variant={ThumbnailVariants.rounded}
                />
                xs
            </div>
            <div style={componentHolder}>
                <Thumbnail
                    theme={theme}
                    image="http://i.pravatar.cc/128"
                    size={ThumbnailSizes.s}
                    variant={ThumbnailVariants.rounded}
                />
                s
            </div>
            <div style={componentHolder}>
                <Thumbnail
                    theme={theme}
                    image="http://i.pravatar.cc/128"
                    size={ThumbnailSizes.m}
                    variant={ThumbnailVariants.rounded}
                />
                m
            </div>
            <div style={componentHolder}>
                <Thumbnail
                    theme={theme}
                    image="http://i.pravatar.cc/128"
                    size={ThumbnailSizes.l}
                    variant={ThumbnailVariants.rounded}
                />
                l
            </div>
            <div style={componentHolder}>
                <Thumbnail
                    theme={theme}
                    image="http://i.pravatar.cc/128"
                    size={ThumbnailSizes.xl}
                    variant={ThumbnailVariants.rounded}
                />
                xl
            </div>
        </div>
    </div>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
