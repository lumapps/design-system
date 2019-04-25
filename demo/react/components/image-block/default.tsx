import React, { CSSProperties, Fragment } from 'react';

import { ImageBlock, ImageBlockCaptionPositions, ImageBlockProps, ImageBlockTheme, ThumbnailAspectRatios } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ImageBlockTheme;
}

/////////////////////////////

const imageBlockDemoStyle: CSSProperties = {
    display: 'inline-block',
    margin: 16,
    width: '23%',
};

const imageBlockDemoProps: Partial<ImageBlockProps> = {
    description: 'What an image',
    tags: ['#tag1', '#tag2', '#tag3'],
    title: 'Nice Image',
};

/**
 * The demo for the default <ImageBlock>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <ImageBlock theme={theme} image="https://picsum.photos/640/480/?random" style={imageBlockDemoStyle} />
        <ImageBlock
            aspectRatio={ThumbnailAspectRatios.vertical}
            theme={theme}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
        />
        <ImageBlock
            aspectRatio={ThumbnailAspectRatios.horizontal}
            theme={theme}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
        />
        <ImageBlock
            theme={theme}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
            {...imageBlockDemoProps}
        />
        <ImageBlock
            aspectRatio={ThumbnailAspectRatios.vertical}
            theme={theme}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
            {...imageBlockDemoProps}
        />
        <ImageBlock
            aspectRatio={ThumbnailAspectRatios.horizontal}
            theme={theme}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
            {...imageBlockDemoProps}
        />
        <ImageBlock
            captionPosition={ImageBlockCaptionPositions.over}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
            theme={theme}
            {...imageBlockDemoProps}
        />
        <ImageBlock
            aspectRatio={ThumbnailAspectRatios.vertical}
            captionPosition={ImageBlockCaptionPositions.over}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
            theme={theme}
            {...imageBlockDemoProps}
        />
        <ImageBlock
            aspectRatio={ThumbnailAspectRatios.horizontal}
            captionPosition={ImageBlockCaptionPositions.over}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
            theme={theme}
            {...imageBlockDemoProps}
        />
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
