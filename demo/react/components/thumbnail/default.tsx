import React, { CSSProperties } from 'react';

import { Thumbnail, ThumbnailAspectRatios, ThumbnailTheme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ThumbnailTheme;
}

/////////////////////////////
const componentHolder: CSSProperties = {
    fontSize: 11,
    margin: 8,
    width: 200,
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
                <Thumbnail theme={theme} image="http://i.pravatar.cc/200" />
            </div>
            <div style={componentHolder}>
                <Thumbnail
                    aspectRatio={ThumbnailAspectRatios.horizontal}
                    image="http://i.pravatar.cc/200"
                    theme={theme}
                />
            </div>
            <div style={componentHolder}>
                <Thumbnail
                    aspectRatio={ThumbnailAspectRatios.vertical}
                    image="http://i.pravatar.cc/200"
                    theme={theme}
                />
            </div>
        </div>
    </div>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
