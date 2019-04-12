import React, { CSSProperties } from 'react';

import { Thumbnail, ThumbnailSizes, ThumbnailTheme } from 'LumX';

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
 * The demo for the default <Thumbnail>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ display: 'flex' }}>
            <div style={componentHolder}>
                <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.xxs} />
                xxs
            </div>
            <div style={componentHolder}>
                <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.xs} />
                xs
            </div>
            <div style={componentHolder}>
                <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.s} />s
            </div>
            <div style={componentHolder}>
                <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.m} />m
            </div>
            <div style={componentHolder}>
                <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.l} />l
            </div>
            <div style={componentHolder}>
                <Thumbnail theme={theme} image="http://i.pravatar.cc/128" size={ThumbnailSizes.xl} />
                xl
            </div>
        </div>
    </div>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
