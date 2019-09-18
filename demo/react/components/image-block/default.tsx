import React, { CSSProperties, ReactElement } from 'react';

import { Alignment, ImageBlock, ImageBlockCaptionPosition, ImageBlockProps, Theme, ThumbnailAspectRatio } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

const imageBlockDemoStyle: CSSProperties = {
    display: 'inline-block',
    margin: 16,
    width: '23%',
};

const imageBlockDemoProps: Partial<ImageBlockProps> = {
    description: 'What an image',
    onClick: (): void => {
        // tslint:disable-next-line: no-console
        console.log('Thumbnail clicked');
    },
    tags: ['#tag1', '#tag2', '#tag3'],
    title: 'Nice Image',
};

/**
 * The demo for the default <ImageBlock>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <ImageBlock theme={theme} image="https://picsum.photos/640/480/?random" style={imageBlockDemoStyle} />
        <ImageBlock
            aspectRatio={ThumbnailAspectRatio.vertical}
            theme={theme}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
        />
        <ImageBlock
            aspectRatio={ThumbnailAspectRatio.horizontal}
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
            aspectRatio={ThumbnailAspectRatio.vertical}
            theme={theme}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
            {...imageBlockDemoProps}
        />
        <ImageBlock
            aspectRatio={ThumbnailAspectRatio.horizontal}
            theme={theme}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
            {...imageBlockDemoProps}
        />
        <ImageBlock
            captionPosition={ImageBlockCaptionPosition.over}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
            theme={theme}
            {...imageBlockDemoProps}
        />
        <ImageBlock
            aspectRatio={ThumbnailAspectRatio.vertical}
            captionPosition={ImageBlockCaptionPosition.over}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
            theme={theme}
            {...imageBlockDemoProps}
        />
        <ImageBlock
            aspectRatio={ThumbnailAspectRatio.horizontal}
            captionPosition={ImageBlockCaptionPosition.over}
            image="https://picsum.photos/640/480/?random"
            style={imageBlockDemoStyle}
            theme={theme}
            {...imageBlockDemoProps}
        />
        <ImageBlock
            align={Alignment.center}
            aspectRatio={ThumbnailAspectRatio.horizontal}
            captionPosition={ImageBlockCaptionPosition.over}
            image="https://picsum.photos/640/480/?random"
            style={{ ...imageBlockDemoStyle, width: '95%' }}
            theme={theme}
            {...imageBlockDemoProps}
        />
        <ImageBlock
            align={Alignment.right}
            aspectRatio={ThumbnailAspectRatio.horizontal}
            captionPosition={ImageBlockCaptionPosition.over}
            image="https://picsum.photos/640/480/?random"
            style={{ ...imageBlockDemoStyle, width: '95%' }}
            theme={theme}
            {...imageBlockDemoProps}
        />
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
