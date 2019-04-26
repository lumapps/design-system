import React, { CSSProperties, Fragment } from 'react';

import { Thumbnail, ThumbnailAspectRatios, ThumbnailSizes, ThumbnailTheme } from 'LumX';

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
    <Fragment>
        <h2>Aspect-ratio : original</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ display: 'flex' }}>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={ThumbnailSizes.xxs} />
                    xxs
                </div>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={ThumbnailSizes.xs} />
                    xs
                </div>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={ThumbnailSizes.s} />s
                </div>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={ThumbnailSizes.m} />m
                </div>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={ThumbnailSizes.l} />l
                </div>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={ThumbnailSizes.xl} />
                    xl
                </div>
            </div>
        </div>
        <h2>Aspect-ratio : horizontal</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ display: 'flex' }}>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.xxs}
                    />
                    xxs
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.xs}
                    />
                    xs
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.s}
                    />
                    s
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.m}
                    />
                    m
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.l}
                    />
                    l
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.xl}
                    />
                    xl
                </div>
            </div>
        </div>
        <h2>Aspect-ratio : vertical</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ display: 'flex' }}>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.xxs}
                    />
                    xxs
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.xs}
                    />
                    xs
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.s}
                    />
                    s
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.m}
                    />
                    m
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.l}
                    />
                    l
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatios.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.xl}
                    />
                    xl
                </div>
            </div>
        </div>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
