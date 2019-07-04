import React, { CSSProperties, ReactElement } from 'react';

import { Size, Theme, Thumbnail, ThumbnailAspectRatio } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
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
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <h2>Aspect-ratio : original</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ display: 'flex' }}>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={Size.xxs} />
                    xxs
                </div>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={Size.xs} />
                    xs
                </div>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={Size.s} />s
                </div>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={Size.m} />m
                </div>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={Size.l} />l
                </div>
                <div style={componentHolder}>
                    <Thumbnail theme={theme} image="http://i.pravatar.cc/200" size={Size.xl} />
                    xl
                </div>
            </div>
        </div>
        <h2>Aspect-ratio : horizontal</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ display: 'flex' }}>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.xxs}
                    />
                    xxs
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.xs}
                    />
                    xs
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.s}
                    />
                    s
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.m}
                    />
                    m
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.l}
                    />
                    l
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.xl}
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
                        aspectRatio={ThumbnailAspectRatio.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.xxs}
                    />
                    xxs
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.xs}
                    />
                    xs
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.s}
                    />
                    s
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.m}
                    />
                    m
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.l}
                    />
                    l
                </div>
                <div style={componentHolder}>
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.vertical}
                        theme={theme}
                        image="http://i.pravatar.cc/200"
                        size={Size.xl}
                    />
                    xl
                </div>
            </div>
        </div>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
