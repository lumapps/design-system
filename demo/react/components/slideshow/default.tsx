import React, { CSSProperties, ReactElement } from 'react';

import {
    ImageBlock,
    ImageBlockCaptionPosition,
    ImageBlockProps,
    Slideshow,
    SlideshowItem,
    Theme,
    ThumbnailAspectRatio,
} from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

const slideshowWrapperStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
};

const slideshowStyle: CSSProperties = {
    width: '50%',
};

const imageBlockDemoProps: Partial<ImageBlockProps> = {
    description: 'What an image',
    tags: ['#tag1', '#tag2', '#tag3'],
    title: 'Nice Image',
};

/**
 * The demo for the default <Slideshow>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <div style={slideshowWrapperStyle}>
        <Slideshow activeIndex={3} hasControls={true} theme={theme} autoPlay={true} groupBy={1} style={slideshowStyle}>
            <SlideshowItem>
                <ImageBlock theme={theme} image="https://picsum.photos/640/480/?image=23" />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    theme={theme}
                    image="https://picsum.photos/640/480/?image=24"
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.horizontal}
                    theme={theme}
                    image="https://picsum.photos/640/480/?image=25"
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock theme={theme} image="https://picsum.photos/640/480/?image=26" {...imageBlockDemoProps} />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    theme={theme}
                    image="https://picsum.photos/640/480/?image=27"
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.horizontal}
                    theme={theme}
                    image="https://picsum.photos/640/480/?image=28"
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=29"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=30"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=31"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>
        </Slideshow>
    </div>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
